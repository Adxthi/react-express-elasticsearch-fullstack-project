// controllers/productController.js
const Product = require('../models/Products'); // Adjust the path as necessary
const {Client}=require('@elastic/elasticsearch');
const client = new Client({node:'http://localhost:9200'});
// Get all products with pagination
exports.getAllProducts = async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // Default to 10 items per page
    const search= req.query.search || '';
    // Calculate the starting index for the products to fetch
    const startIndex = (page - 1) * limit;

    // Fetch the products from the database with pagination
    const updatedProducts = await Product.find({product_name: new RegExp(search, 'i')}) // Perform case-insensitive search on product_name (with search)
      .limit(limit) // Limit the number of products returned
      .skip(startIndex); // Skip the products from previous pages

    // Count the total number of products for pagination info
    const totalProducts = await Product.find({product_name: new RegExp(search, 'i')}).countDocuments();

    // Prepare the response with pagination information
    const response = {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit), // Calculate total pages
      currentPage: page,
      updatedProducts, // List of products for the current page
    };

    res.status(200).json(response); // Send the response as JSON
  } catch (err) {
    console.error(err.message); // Log any errors that occur
    res.status(500).send('Server error'); // Send a 500 response if an error occurs
  }
};
exports.createProducts = async (req, res) => {
  try {
    const productsArray = req.body; // Expecting an array of product data 
    // Validate if the array is present
    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    } 

    const createdProducts = [];

    // Loop through each product in the array
    for (let productData of productsArray) {
      const { product_id, product_name,product_category,MRP,description,discount_price,availability_count } = productData;

      // Check if category is provided for each product
    

      // 

      // Create the new product
      const product = new Product({
        product_id,
        product_name,
        product_category,
        description,
        MRP,
        discount_price,
        availability_count
      });

      // Save the product
      await product.save();
      product.on('es-indexed', (err, result) => {
        if (err) console.log('Error indexing to Elasticsearch', err);
        else console.log('Product indexed successfully');
      }); 

      // Add the created product to the response array
      createdProducts.push(product);
    }

    res.status(201).json({ message: 'Products created successfully', products: createdProducts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};  


// Get all categories
exports.getAllCategories = async (req, res) => {
  const { category } = req.params;
  try {
    // Parse page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // Default to 5 items per page
    const search= req.query.search || '';
    // Calculate the starting index for the products to fetch
    const startIndex = (page - 1) * limit;

    // Fetch products based on category with pagination
    const products = await Product.find({ "product_category":category,product_name:new RegExp(search, 'i') })
      .limit(limit)
      .skip(startIndex);
    // Get the total number of products in that category
    const totalProducts = await Product.countDocuments({ "product_category": category });

    // Prepare the response with pagination information
    const response = {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit), // Calculate total pages
      currentPage: page,
      products, // List of products for the current page
    };

    // Send the response
    res.status(200).json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getElasticSearch = async (req, res) => {
  const page = parseInt(req.query.page)||1;
    const pageSize = parseInt(req.query.pageSize)||6;  
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;  
  const processedQuery = req.query.search || ''; // Default to an empty string if undefined

  if (!processedQuery) {
    return res.status(400).json({ error: 'Search term is required.' });
  }

  // Regular expressions to extract price conditions and their values
  const priceConditionMatch = processedQuery.match(/(above|below|greater than|less than|gt|lt|at|under|over)\s*(\d+)/i);
  let rangeCondition = null;
  let priceValue = null;

  // Determine the range condition and price value if present
  if (priceConditionMatch) {
    const condition = priceConditionMatch[1].toLowerCase();
    priceValue = parseInt(priceConditionMatch[2], 10);
    
    // Map user-friendly terms to Elasticsearch conditions
    rangeCondition = condition === 'above' || condition === 'greater than' || condition === 'gt' || condition === 'over'
      ? 'gt' 
      : 'lt'; 
  }
 
  const body = {
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query: processedQuery.replace(/(above|below|greater than|less than|gt|lt|under|over)\s*\d+/i, '').trim(),
              fields: [
                'product_name^2', 
                'product_category^1',  
                'description'  
              ],
              type: 'most_fields'  ,
              fuzziness: '1'
            },
          },
        ],
        ...(rangeCondition && {
          filter: {
            range: {
              discount_price: {
                [rangeCondition]: priceValue,
              },
            },
          },
        }),
      },
    },
    // Add aggregations for category suggestions
 
    size: 50, // Limit the number of search results returned
  };

 

  try {
    // Perform the search using the Elasticsearch client
    const  searchResponse  = await client.search({
      index: 'products',  
      body,
    });
    const results = searchResponse.hits.hits.map(hit=>hit._source);
    const totalCount =results.length;  
        const totalPages = Math.ceil(totalCount/ pageSize);
        const updatedProducts =results.slice(startIndex,endIndex)
    const categorySuggestions = searchResponse.aggregations;

    return res.json({ updatedProducts, totalPages,categorySuggestions });
  } catch (error) {
    console.error('Elasticsearch search error:', error);
    return res.status(500).json({ error: 'Error fetching results from Elasticsearch' });
  }
};

// Search products by name, category, or description
// exports.searchProducts = async (req, res) => {
//   const { query } = req.query;

//   try {
//     // Perform case-insensitive search on product_name, product_category, and description
//     const products = await Product.find({
//       $or: [
//         { product_name: { $regex: query, $options: 'i' } },
//         { product_category: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } },
//       ],
//     });

//     if (products.length === 0) {
//       return res.status(404).json({ msg: 'No products found' });
//     }

//     res.status(200).json(products);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };
