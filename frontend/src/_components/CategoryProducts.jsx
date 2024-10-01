import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../CategoryProducts.css';

const CategoryProducts = () => {
  const { category } = useParams(); // Extract category from URL
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [filteredProducts, setFilteredProducts] = useState([]); // Products after search filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5); // Set the limit of products per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/product/category/${category}?page=${currentPage}&limit=${limit}`);
        if (response.data && response.data.products) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
          setFilteredProducts(response.data.products); // Set filtered products initially
        } else {
          throw new Error('Invalid response structure'); 
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage, limit]);

  // Filter products based on the search term
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.product_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>; 
  }

  return (
    <div className="category-products-container">
      <h2 className="category-title">{category} Products</h2>

      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
        placeholder='Search'
        style={{
          display: "block",
          margin: "0 auto",  
          padding: "8px 12px",  
          borderRadius: "4px",  
          border: "1px solid #ccc",
        }} 
      />

      <div className="products-list">
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <Link to={`/product/${product._id}`} key={index} className="product-link">
              <div className="product-card">
                <img
                  src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8_WMKcKElma32eJRKTcvjDFB2zYs1c5akJA&s'}
                  alt={product.product_name}
                  className="product-image"
                />
                <h3 className="product-name">{product.product_name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">₹{product.MRP}</p>
                <p className="product-discount">New price: ₹ {product.discount_price}</p>
                <button className="add-to-cart-button">Add to Cart</button>
              </div>
            </Link>
          ))
        ) : (
          <div>No products found in this category.</div>
        )}
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default CategoryProducts;
