import React, { useState, useEffect } from "react";
import "./App.css";
import HomePage from './pages/HomePage/HomePage'
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchProvider";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from "./pages/UserPage/UserPage";
import ImagePage from "./pages/ImagePage/ImagePage";
import Header from "./components/Header/Header";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
      <ToastContainer 
        position="top-center"
        autoClose={4000}
      />
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/users" element={<UserPage/>} />
            <Route path="/images" element={<HomePage/>} />
            <Route path="/images/:imageId" element={<ImagePage />} />
            {/* ... other routes */}
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  )
}

export default App;
