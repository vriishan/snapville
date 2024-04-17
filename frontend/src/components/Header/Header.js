// Header.js

import React, { useState } from "react";
import "./Header.css";
import { FaSearch } from "react-icons/fa";
import { IMAGE_ENDPOINT } from "../../utils/constants";
import RegisterModal from "../Register/RegisterModal";
import LoginModal from "../Login/LoginModal";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchProvider";
import UploadPopup from "../Upload/UploadPopup";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [ searchValue, setSearchValue ] = useState("");
  const { searchTerm, setSearchTerm } = useSearch();
  const [openUploadPopup, setOpenUploadPopup] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      <div className="header__logo">
        <a href="/" style={{ textDecoration: 'none', cursor: 'pointer', color: '#fff' }}>snapville</a>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="header__searchContainer">
          <input className="header__search" type="text" placeholder="Search by tag..." value={searchValue} onChange={handleChange}></input>
          <button type="submit" className="header__searchButton"><FaSearch className="header__searchIcon" /></button>
        </div>
      </form>
      <div className="header__buttonContainer">
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
