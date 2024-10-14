// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend origin
app.use(cors({
  origin: 'http://localhost:5173', // Update this to your frontend's origin
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to fetch books from HubSpot
app.get('/api/books', async (req, res) => {
  const hubspotUrl = 'https://api.hubapi.com/crm/v3/objects/books';
  const params = {
    properties: 'book_name,author,price',
    // Add other query parameters if needed
  };
  const headers = {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.get(hubspotUrl, {
      params,
      headers,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching books from HubSpot:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch books from HubSpot' });
  }
});

// Endpoint to delete a book by ID
app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const hubspotUrl = `https://api.hubapi.com/crm/v3/objects/books/${id}`;
  const headers = {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    await axios.delete(hubspotUrl, { headers });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book from HubSpot:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to delete book from HubSpot' });
  }
});

// Serve static files from the frontend (optional, useful for production)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend proxy server is running on port ${PORT}`);
});
