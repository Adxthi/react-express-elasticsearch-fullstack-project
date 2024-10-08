// AllProducts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Products.css';
import { Link } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6); // Ensure this matches your backend default
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [useElasticSearch, setUseElasticSearch] = useState(true); // Default to Elasticsearch enabled

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Construct query parameters
        const params = {
          page: currentPage,
          pageSize: pageSize,
          search: search.trim(),
        };

        // Determine the endpoint based on whether Elasticsearch is used
        const endpoint = useElasticSearch && search.length > 0
          ? `http://localhost:3000/api/product/elasticSearch`
          : `http://localhost:3000/api/product/products`;

        // Make the GET request with query parameters
        const response = await axios.get(endpoint, { params });
        console.log(response.data);
        setProducts(response.data.updatedProducts);
        setTotalPages(response.data.totalPages); // Set the total pages from the response
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize, search, useElasticSearch]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Optional: Reset to first page when search or toggle changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, useElasticSearch]);

  return (
    <div className="products-container">
      {/* Search Input */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Search (e.g., "watches under 200")'
        className="search-input"
      />

      {/* Elasticsearch Toggle */}
      <div className="elasticsearch-toggle">
        <label>
          <input
            type="checkbox"
            checked={useElasticSearch}
            onChange={() => setUseElasticSearch(!useElasticSearch)}
          />
          Use Elasticsearch
        </label>
      </div>

      <h2 className="heading">All Products</h2>

      <Link to="/" className="exit-button" align="right">Exit</Link>
      
      Loading Indicator
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="products-list">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div className="product-card" key={index}>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALkAAAEQCAMAAADbFyX8AAAAeFBMVEXl5eUAAADo6Ojr6+vt7e3b29uJiYmMjIzj4+PGxsYdHR2SkpKwsLC7u7unp6fd3d0wMDAQEBDPz89nZ2cnJyeDg4M1NTVfX19VVVXz8/NaWlpzc3PDw8NQUFA9PT2tra1GRkYzMzN5eXmampoZGRkjIyNra2s7OzsOw3lmAAADY0lEQVR4nO3X25aqOhCF4VQSFJSzeAZ1iYf3f8NdwW6Hvcbq2w0X/ze6IUEvpmVJiDEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBUVn2P3kf7Pf578n1llKg/RYkyPgyTJBrmOqyT2g5X9GR1omOrk3CI7Nc7R+Zmou6rQsciS+fmsohs8ZQ/hUYWeXjjTyKxDS933j/k5G0kko5e9ZC8XIhc/I/kG5HE2kxkpcmf35Ont6lI5HtZxGMHH5IX9iiibfGRvAlVdetXcv0YvXW9yMYbK5L7Vbg8tpDcOK3k+TN5dBe5en8Q2boh+dX5rX453riH9ox+LDd28CF5HHogd5/JF6Gpi7IKyV0p1dP4RSWN1jyVSv/Gb5ZX8lDz/EfNF82pKWrp5KD3llIOEkeyDclDu9yn0CwfyX/UvCqPUqeylJ2+p5Re2kxmstDA2i5Da43u1+SppFdJh+SNnnsNL7dQ87NMoll+Sy5lItfDqZXOmLiRqLrupJBqaBL92U6gWX5PHl2aZlV/JbenjeziV3JbyWz8O8tH8rP1Q3Lt5iIkN9rPy1ouxmpyo3f2mX6yr+TrqSS3+z6sRG4h3V7v4aXT5Buj1xJNHpviLrE29zmeXvLlfFj9w3Cni8/MD8kTqepaTrENyRNdaadW83V44pJLePazXRh2cXjUakwkJz2XoXWkcPrNfCcPK+rYsZWt0yzLYj/coH2d53VIF2eZtW1i46zVmb5u21aXz2x4V5bWE7idm8+dxcf4tYl4bzM+Ju+NxoR87HnMe6j/79PkEn+xWZ7Hekh1GOW1jdM8tEzm0sSac+vq/JzXY4f8J395bm/ueek2ppaHpEV1KFf7x27frP2f3X2ebOWYTLLq/rLeS3tZOkmW5X61jRdpJsVxu9/ME4n7jW+HPd0E+csxleh0zaWYD8lvmjz6Sh7VmW7nxt82/5Pv7rvMXxrp9/N3zd/J9Rc63eTaLdae+uNxP/ur5q0U/c5NOLkujfa5zG8+r4ruGt/O/T3uT8UtjyRZ73wWKj9F7hAeXru+qBKzWnRRcSnL1EW7xSr2y6ZMXDvVmhvvXgd9EvBenwH0YM1r6MLQ+mmWHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4P/wH/OJLNPFDk1pAAAAAElFTkSuQmCC" // Dummy image
                  alt={product.product_name}
                  className="product-image"
                />
                <h3 className="product-name">{product.product_name}</h3>
                <p className="product-description">{product.description}</p>
                <p className='product-category'>{product.product_category}</p>
                <p className="product-price">MRP: {product.MRP}</p>
                <p className="product-price">Discount Price: {product.discount_price}</p>
              </div>
            ))
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default AllProducts;
