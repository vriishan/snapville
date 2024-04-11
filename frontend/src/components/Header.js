import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

const Header = ({ handleUploadPopupOpen }) => {
  return (
    <div className="header">
      <div className="header__logo"><Link to={'/'} style={{ textDecoration: 'none'}}>snapville</Link></div>

      <input className="header__search" type="text"></input>

      <div className="header__buttonContainer">
        <div
          className="buttonContainer__button"
          onClick={handleUploadPopupOpen}
        >
          Create a New Post
        </div>
        <div className="buttonContainer__button"><Link to={'/signin'}>Sign In</Link></div>
        <div className="buttonContainer__button"><Link to={'/register'}>Register</Link></div>
        {/* TODO: more buttons go here */}
      </div>
    </div>
  );
};

export default Header;
