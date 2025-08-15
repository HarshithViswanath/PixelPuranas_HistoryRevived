import React, { useState } from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const PdfDownloadButton = ({ contentRef, fileName = 'historical-events.pdf' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    if (!contentRef.current) {
      setError('No content to download');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '0';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.minHeight = '297mm';
      container.style.padding = '15mm';
      container.style.backgroundColor = 'white';
      container.style.zIndex = '9999';
      container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
      
      // Clone the content
      const contentClone = contentRef.current.cloneNode(true);
      
      // Apply styles to ensure visibility and proper text formatting
      contentClone.style.color = 'black';
      contentClone.style.backgroundColor = 'white';
      contentClone.style.width = '100%';
      contentClone.style.height = 'auto';
      contentClone.style.overflow = 'visible';
      contentClone.style.fontFamily = 'Arial, sans-serif';
      contentClone.style.fontSize = '10pt';
      contentClone.style.lineHeight = '1.3';
      
      // Process text content
      const textElements = contentClone.getElementsByTagName('*');
      Array.from(textElements).forEach((element) => {
        // Set consistent text styling
        element.style.color = 'black';
        element.style.backgroundColor = 'white';
        
        // Adjust heading sizes
        if (element.tagName.startsWith('H')) {
          const level = parseInt(element.tagName[1]);
          element.style.fontSize = `${20 - (level * 2)}pt`;
          element.style.fontWeight = 'bold';
          element.style.marginTop = '10px';
          element.style.marginBottom = '5px';
        }
        
        // Adjust paragraph spacing
        if (element.tagName === 'P') {
          element.style.marginBottom = '5px';
          element.style.textAlign = 'justify';
        }
        
        // Adjust list items
        if (element.tagName === 'LI') {
          element.style.marginBottom = '3px';
          element.style.paddingLeft = '15px';
        }

        // Process links
        if (element.tagName === 'A') {
          const url = element.getAttribute('href');
          if (url) {
            element.textContent = `${element.textContent} (${url})`;
            element.style.color = 'blue';
            element.style.textDecoration = 'underline';
          }
        }
      });
      
      // Process images in the cloned content
      const images = contentClone.getElementsByTagName('img');
      Array.from(images).forEach((img) => {
        // Ensure image paths are absolute
        if (img.src.startsWith('/')) {
          img.src = window.location.origin + img.src;
        }
        img.style.display = 'block';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.margin = '8px 0';
        img.style.maxHeight = '150px';
      });
      
      // Add the clone to the container
      container.appendChild(contentClone);
      document.body.appendChild(container);

      // Wait for images to load
      await Promise.all(
        Array.from(images).map(
          img => new Promise((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = resolve;
              img.onerror = resolve;
            }
          })
        )
      );

      // Configure html2canvas options
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        onclone: (clonedDoc) => {
          // Ensure all content is visible and properly formatted
          const allElements = clonedDoc.getElementsByTagName('*');
          Array.from(allElements).forEach((element) => {
            element.style.color = 'black';
            element.style.backgroundColor = 'white';
          });

          // Handle images
          const images = clonedDoc.getElementsByTagName('img');
          Array.from(images).forEach((img) => {
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.margin = '8px 0';
            img.style.maxHeight = '150px';
          });

          // Handle links
          const links = clonedDoc.getElementsByTagName('a');
          Array.from(links).forEach((link) => {
            const url = link.getAttribute('href');
            if (url) {
              link.textContent = `${link.textContent} (${url})`;
              link.style.color = 'blue';
              link.style.textDecoration = 'underline';
            }
          });
        }
      });

      // Remove the temporary container
      document.body.removeChild(container);

      // Create PDF
      if (!window.jspdf) {
        throw new Error('jsPDF library not loaded');
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add content to single page
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <Download size={20} />
      )}
      {isLoading ? 'Generating PDF...' : 'Download PDF'}
      {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
    </button>
  );
};

export default PdfDownloadButton; 