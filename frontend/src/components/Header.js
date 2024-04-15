// Header.js

import React, { useState } from "react";
import "./header.css";
import { FaSearch } from "react-icons/fa";

const Header = ({ handleUploadPopupOpen, isLoggedIn, handleLogout, setShowRegisterModal, setShowLoginModal, handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchTerm);
  };

  return (
    <div className="header">
      <div className="header__logo">
        <a href="/" style={{ textDecoration: 'none', cursor: 'pointer', color: '#fff' }}>snapville</a>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="header__searchContainer">
          <input className="header__search" type="text" placeholder="Search" value={searchTerm} onChange={handleChange}></input>
          <button type="submit" className="header__searchButton"><FaSearch className="header__searchIcon" /></button>
        </div>
      </form>
      <div className="header__buttonContainer">
        {isLoggedIn && (
          <div className="buttonContainer__button" onClick={handleUploadPopupOpen}>
            Upload Image
          </div>
        )}
        {isLoggedIn ? (
          <div className="buttonContainer__button" onClick={handleLogout}>
            Logout
          </div>
        ) : (
          <>
            <div className="buttonContainer__button" onClick={() => setShowLoginModal(true)}>
              Login
            </div>
            <div className="buttonContainer__button" onClick={() => setShowRegisterModal(true)}>
              Register
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
