import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './frontend/Header';
import HomePage from './frontend/HomePage';
import TimelinePage from './frontend/TimelinePage';
import CategoriesPage from './frontend/CategoriesPage';
import AboutPage from './frontend/AboutPage';
import ContactPage from './frontend/ContactPage';
import EventDetailsPage from './frontend/EventDetailsPage';
import HistoricalEventsApp from './frontend/HistoricalEventsApp';

// Import Indian heritage styles
import './styles/indianHeritage.css';

function App() {
  return (
    <Router>
      <motion.div
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/event/:id" element={<EventDetailsPage />} />
            <Route path="/events" element={<HistoricalEventsApp />} />
          </Routes>
        </main>

        <style jsx>{`
          .app-container {
            min-height: 100vh;
            background: #f5f6fa;
          }

          .main-content {
            padding-top: 80px;
          }
        `}</style>
      </motion.div>
    </Router>
  );
}

export default App;