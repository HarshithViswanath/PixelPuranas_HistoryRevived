import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <motion.div
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="contact-content">
        <h1>Contact Us</h1>
        
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have questions, suggestions, or feedback? We'd love to hear from you.
              Fill out the form and we'll get back to you as soon as possible.
            </p>

            <div className="info-item">
              <h3>📧 Email</h3>
              <p>contact@indianheritage.com</p>
            </div>

            <div className="info-item">
              <h3>📱 Social Media</h3>
              <div className="social-links">
                <button 
                  onClick={() => window.open('https://twitter.com', '_blank')}
                  className="social-button"
                >
                  Twitter
                </button>
                <button 
                  onClick={() => window.open('https://facebook.com', '_blank')}
                  className="social-button"
                >
                  Facebook
                </button>
                <button 
                  onClick={() => window.open('https://instagram.com', '_blank')}
                  className="social-button"
                >
                  Instagram
                </button>
                <button 
                  onClick={() => window.open('https://youtube.com', '_blank')}
                  className="social-button"
                >
                  YouTube
                </button>
              </div>
            </div>

            <div className="info-item">
              <h3>⏰ Response Time</h3>
              <p>We typically respond within 24-48 hours</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .contact-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .contact-content {
          background: var(--off-white);
          padding: 3rem;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
          border: 1px solid var(--gold);
          position: relative;
        }
        
        .contact-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--deep-saffron), var(--gold), var(--deep-saffron));
        }

        h1 {
          text-align: center;
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 3rem;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        .contact-info {
          padding-right: 2rem;
        }

        h2 {
          color: #2c3e50;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
        }

        p {
          color: #666;
          line-height: 1.8;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .info-item {
          margin-bottom: 2rem;
        }

        .info-item h3 {
          color: #e67e22;
          margin-bottom: 0.5rem;
          font-size: 1.3rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-button {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
          transition: color 0.3s ease;
        }

        .social-button:hover {
          color: #e67e22;
        }

        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid var(--gold);
          position: relative;
        }
        
        .contact-form::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 60px;
          height: 60px;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%23DAA520" opacity="0.2" d="M0,0 C50,20 80,50 100,100 L0,100 Z"/></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: bottom right;
          opacity: 0.3;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          font-weight: 500;
        }

        input,
        textarea {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        input:focus,
        textarea:focus {
          outline: none;
          border-color: #e67e22;
        }

        .submit-button {
          background: linear-gradient(135deg, var(--deep-saffron) 0%, var(--gold) 100%);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3);
        }

        .submit-button:hover {
          background: linear-gradient(135deg, var(--gold) 0%, var(--deep-saffron) 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(139, 69, 19, 0.4);
        }

        @media (max-width: 768px) {
          .contact-page {
            padding: 1rem;
          }

          .contact-content {
            padding: 2rem;
          }

          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .contact-info {
            padding-right: 0;
          }

          h1 {
            font-size: 2rem;
          }

          h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ContactPage; 