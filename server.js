const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Event schema and model
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  year: String,
  image: String,
  category: String,
  location: String,
  significance: String,
  createdAt: { type: Date, default: Date.now }
});
const Event = mongoose.model('Event', eventSchema);

// Basic GET endpoint
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Database status endpoint
app.get('/api/database/status', async (req, res) => {
  try {
    const eventCount = await Event.countDocuments();
    const categories = await Event.distinct('category');
    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5);
    
    res.json({
      status: 'connected',
      database: 'pixelpuranas',
      collections: ['events'],
      eventCount,
      categories,
      recentEvents,
      timestamp: new Date(),
      connection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      message: err.message 
    });
  }
});

// Database statistics endpoint
app.get('/api/database/stats', async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const categories = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const yearStats = await Event.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalEvents,
      categories,
      yearStats,
      databaseSize: await Event.collection.stats()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search events endpoint
app.get('/api/events/search', async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;
    let query = {};
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const events = await Event.find(query).limit(parseInt(limit));
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get events by category
app.get('/api/events/category/:category', async (req, res) => {
  try {
    const events = await Event.find({ category: req.params.category });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add sample data endpoint
app.post('/api/events/sample', async (req, res) => {
  try {
    const sampleEvents = [
      {
        title: "Indus Valley Civilization",
        description: "One of the world's oldest urban civilizations",
        year: "3300-1300 BCE",
        category: "Ancient",
        location: "South Asia",
        significance: "First major civilization in South Asia"
      },
      {
        title: "Maurya Empire",
        description: "First pan-Indian empire",
        year: "322-185 BCE",
        category: "Ancient",
        location: "India",
        significance: "Unified most of the Indian subcontinent"
      },
      {
        title: "Mughal Empire",
        description: "Islamic empire in South Asia",
        year: "1526-1857",
        category: "Medieval",
        location: "India",
        significance: "Cultural and architectural achievements"
      }
    ];
    
    const result = await Event.insertMany(sampleEvents);
    res.json({ message: 'Sample data added', count: result.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database status: http://localhost:${PORT}/api/database/status`);
  console.log(`Database stats: http://localhost:${PORT}/api/database/stats`);
  console.log(`All events: http://localhost:${PORT}/api/events`);
}); 