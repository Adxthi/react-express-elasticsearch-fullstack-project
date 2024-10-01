// routes/categoriesRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Products'); // Adjust the path as per your project structure

// @route   GET /api/categories
// @desc    Get all unique categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Product.distinct('product_category');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
