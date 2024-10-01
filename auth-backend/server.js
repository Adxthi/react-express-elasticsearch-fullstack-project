const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes'); // Only if using separate categories routes
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/categories', categoriesRoutes); // Only if using separate categories routes

// Health Check Route
app.get('/', (req, res) => {
  console.log("server running");
  res.send("server running");
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

