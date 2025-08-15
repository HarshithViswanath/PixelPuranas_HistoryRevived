import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, BarChart3, Search, Plus, RefreshCw } from 'lucide-react';

const DatabaseViewer = () => {
  const [databaseStatus, setDatabaseStatus] = useState(null);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchDatabaseStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/database/status');
      const data = await response.json();
      setDatabaseStatus(data);
    } catch (error) {
      console.error('Error fetching database status:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/database/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const addSampleData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events/sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      alert(`Added ${data.count} sample events!`);
      fetchEvents();
      fetchStats();
    } catch (error) {
      console.error('Error adding sample data:', error);
    }
  };

  const searchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`http://localhost:5000/api/events/search?${params}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDatabaseStatus(),
        fetchEvents(),
        fetchStats()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="database-viewer p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-orange-600">
            <Database className="inline mr-2" />
            PixelPuranas Database
          </h1>
          <p className="text-gray-600">MongoDB Database Viewer and Management</p>
        </div>

        {/* Database Status */}
        {databaseStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Database className="mr-2" />
              Database Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-bold text-green-600">
                  {databaseStatus.connection}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-lg font-bold text-blue-600">
                  {databaseStatus.eventCount}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-lg font-bold text-purple-600">
                  {databaseStatus.categories.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Statistics */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <BarChart3 className="mr-2" />
              Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Events by Category</h3>
                {stats.categories.map((cat, index) => (
                  <div key={index} className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">{cat._id || 'Uncategorized'}</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Database Size</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Documents:</span>
                    <span className="font-semibold">{stats.databaseSize.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Size:</span>
                    <span className="font-semibold">
                      {(stats.databaseSize.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {databaseStatus?.categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={searchEvents}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 flex items-center"
            >
              <Search className="mr-2" size={16} />
              Search
            </button>
            <button
              onClick={addSampleData}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center"
            >
              <Plus className="mr-2" size={16} />
              Add Sample Data
            </button>
            <button
              onClick={() => {
                fetchEvents();
                fetchStats();
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            >
              <RefreshCw className="mr-2" size={16} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Events ({events.length})</h2>
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No events found. Add some sample data to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event, index) => (
                <motion.div
                  key={event._id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      {event.year}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DatabaseViewer; 