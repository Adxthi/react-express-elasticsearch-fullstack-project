// src/components/Category.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Categories.css';
import axios from 'axios';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories'); // Adjust port if needed
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="category-container">
      {categories.map((category, index) => {
        const categoryName = category; // If category is a string; change this if it's an object
        const categoryImages = {
          Electronics: 'https://images-eu.ssl-images-amazon.com/images/G/31/Img23/Budget3/REC-PC_CC_379x304._SY304_CB564096366_.jpg',
          Accessories: 'https://images-eu.ssl-images-amazon.com/images/G/31/Img24/SMB/Jupiter/Gateway/Desktop_QC_1_NAM_revised_1x_Fashion_Accessories._SY116_CB562451660_.jpg',
          Wearables: 'https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/12e11454-5b40-4e02-81e3-1da51cbfb28c._CR0,0,1200,628_SX507_QL70_.png',
          Sports: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxd4oizUSqXqspkLD1MWrUVG_iFiUDjvBiYA&s',
          Books: 'https://m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/f71e3634-00ac-4adb-8c94-2d0ea61b027a._CR0,16,1280,670_SX507_QL70_.jpeg',
          Fashion: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/MA2024/GW/Jupiter/BTF/PCQC/1x/New/Sarees_372x232._SY116_CB562046867_.jpg',
          Beauty: 'https://m.media-amazon.com/images/I/51PQhsaEcLL._AC_SY200_.jpg',
          "Home Appliances": 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZW2iQNBFnQvAJZ7bTlKRPsRpOOIVmiVoDXg&s',

        };

        const imageUrl = categoryImages[categoryName] || 'https://via.placeholder.com/150'; // Fallback image

        return (
          <Link
            to={`/category/${encodeURIComponent(categoryName)}`}
            key={index}
            className="category-link"
          >
            <div className="category-card">
              <img src={imageUrl} alt={categoryName} className="category-image" />
              <h3 className="category-name">{categoryName}</h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Category;
