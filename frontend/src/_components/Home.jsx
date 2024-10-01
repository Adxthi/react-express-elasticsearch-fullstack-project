import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.searchQuery.value;
    console.log('Search query:', query);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Logged out');
    navigate('/login');
  };

  return (
    <div>
      <header className="header">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="searchQuery"
            placeholder="Search products..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        <div>
        <h1 className="title" align="center" style={{ color: 'white', fontWeight: 'bold',alignContent: 'center'}} >Shopee</h1>
        </div>
        <div className="nav-buttons">
          <button onClick={() => navigate('/categories')} className="nav-button">Categories</button>
          <button onClick={() => navigate('/all-products')} className="nav-button">All Products</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <div className="content">
        <section className="banner">
          <img src="https://images-eu.ssl-images-amazon.com/images/G/31/LEO/Jup24/Phase1/2/FDFO_bank_PC_Header_1500x30055.gif" alt="Banner" />
        </section>

        <section className="offers-section">
          <h2 className="section-title">Exciting Offers</h2>
          <div className="offers">
            <div className="offer">
              <img width={50} height={100} src="https://imgmediagumlet.lbb.in/media/2020/07/5f0585fc5d2fd16e65fae854_1594197500481.jpg?fm=webp&w=250&h=250&dpr=1" />
              <p className="offer-text">Get 50% off on latest ethnic wears!</p>
            </div>
            <div className="offer">
              <img width={"50%"} height={5} src="https://sepiastories.in/wp-content/uploads/2021/02/2861MintGreenDaisyMintGreen01.jpg" alt="Offer 2" />
              <p className="offer-text">Buy 1 Get 1 Free on footwear!</p>
            </div>
            <div className="offer">
              <img width={50} height={100} src="https://blog.learningbix.com/wp-content/uploads/2022/06/applications-of-electronics.png" alt="Offer 3" />
              <p className="offer-text">Flat 30% off on new arrivals!</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
