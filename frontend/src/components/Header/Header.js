// Header.js

import React, { useState } from "react";
import "./Header.css";
import { FaSearch } from "react-icons/fa";
import RegisterModal from "../Register/RegisterModal";
import LoginModal from "../Login/LoginModal";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchProvider";
import UploadPopup from "../Upload/UploadPopup";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [ searchValue, setSearchValue ] = useState("");
  const { setSearchTerm } = useSearch();
  const [openUploadPopup, setOpenUploadPopup] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [activeNav, setActiveNav] = useState('images');

  const navigate = useNavigate();
  
  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
    navigate(`/${navItem}`);
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(searchValue);
  };

  const handleUploadPopupOpen = () => {
    setOpenUploadPopup(true);
  };

  const handleUploadPopupClose = () => {
    setOpenUploadPopup(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="header">
      <div className="header__logoContainer">
        <div className="header__logo">
          <a href="/" style={{ textDecoration: 'none', cursor: 'pointer', color: '#fff' }}>snapville</a>
        </div>
        <div className="header__admin">
          {currentUser && <span>Admin</span>}
        </div>
      </div>
      <div className="header__searchContainer">
        <form onSubmit={handleSubmit}>
          <div className="header__searchContainer__bar">
            <input className="header__search" type="text" placeholder="Search by tag..." value={searchValue} onChange={handleChange}></input>
            <button type="submit" className="header__searchButton"><FaSearch className="header__searchIcon" /></button>
          </div>
        </form>
      </div>
      <div className="header__buttonContainer">
        {currentUser && <div className={`header__navlink ${activeNav === 'images' ? 'active' : ''}`} onClick={() => handleNavClick('images')}>
          <span>Images</span>
        </div>}
        {currentUser && <div className={`header__navlink ${activeNav === 'users' ? 'active' : ''}`} onClick={() => handleNavClick('users')}>
          <span>Users</span>
        </div>}
        {currentUser && (
          <div className="buttonContainer__button" onClick={handleUploadPopupOpen}>
            Upload Image
          </div>
        )}
        {currentUser ? (
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
      {showRegisterModal && <RegisterModal setShowRegisterModal={setShowRegisterModal} />}
      {showLoginModal && (
        <LoginModal setShowLoginModal={setShowLoginModal} />
      )}
      {openUploadPopup && <UploadPopup handleUploadPopupClose={handleUploadPopupClose} />}
    </div>
  );
};

export default Header;
