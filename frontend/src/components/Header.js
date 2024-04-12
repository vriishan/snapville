import React from "react";
import "./header.css";
import { FaSearch } from "react-icons/fa"; 

const Header = ({ handleUploadPopupOpen, isLoggedIn, handleLogout, setShowRegisterModal, setShowLoginModal }) => {
  return (
    <div className="header">
      <div className="header__logo">
        <span style={{ textDecoration: 'none', cursor: 'pointer' }}>snapville</span>
      </div>

      <div className="header__searchContainer">
        <input className="header__search" type="text" placeholder="Search"></input>
        <FaSearch className="header__searchIcon" />
      </div>

      <div className="header__buttonContainer">
        {isLoggedIn && (
          <div className="buttonContainer__button" onClick={handleUploadPopupOpen}>
            Create a New Post
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
