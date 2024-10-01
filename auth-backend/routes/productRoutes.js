const express = require('express');
const { getAllCategories,getAllProducts,searchProducts,createProducts ,getElasticSearch} = require('../controllers/productController');
const router = express.Router();

// POST api/auth/signup
router.get('/products', getAllProducts);

// POST api/auth/login
router.get('/category/:category', getAllCategories);
router.post('/createProduct',createProducts);
router.get('/elasticSearch',getElasticSearch);
module.exports = router;
