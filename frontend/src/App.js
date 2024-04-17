import React, { useState, useEffect } from "react";
import "./App.css";
import HomePage from './pages/HomePage/HomePage'
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchProvider";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from "./pages/UserPage/UserPage";
import Header from "./components/Header/Header";

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/users" element={<UserPage/>} />
            <Route path="/images" element={<HomePage/>} />
            {/* ... other routes */}
          </Routes>
        </Router>
      </SearchProvider>
    </AuthProvider>
  )
}

export default App;
