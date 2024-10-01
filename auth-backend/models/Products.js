const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const {Client}=require('@elastic/elasticsearch');
const client = new Client({node:'http://localhost:9200'});
// Define the ProductSchema
const ProductSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        es_indexed: true, // This field will be indexed in Elasticsearch
    },
    product_name: {
        type: String,
        required: true,
        es_indexed: true, // Indexed in Elasticsearch
    },
    product_category: {
        type: String,
        required: true,
        es_indexed: true,
    },
    MRP: {
        type: Number,
        required: true,
        es_indexed: true,
    },
    description: {
        type: String,
        required: true,
        es_indexed: true,
    },
    discount_price: {
        type: Number,
        required: true,
        es_indexed: true,
    },
    availability_count: {
        type: Number,
        required: true,
        es_indexed: true,
    }
});

// Apply the mongoosastic plugin
ProductSchema.plugin(mongoosastic, {
    client, // Elasticsearch host (use your own host if different)
    index:"products",
    type:"_doc"  // Protocol used for communication
});

// Create the model
const Product = mongoose.model('Products', ProductSchema);

// Synchronize the existing MongoDB data with Elasticsearch
 

module.exports = Product;
