import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './_components/Home.jsx'
import Signup from './_components/Signup.jsx'
import Signin from './_components/Signin.jsx'
import AllProducts from './_components/AllProducts.jsx'
import Category from './_components/Category.jsx';
import CategoryProducts from './_components/CategoryProducts.jsx'
import {AuthProvider} from './AuthContext.jsx'

const App = () => {
  return (
    <AuthProvider>

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Category />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App
