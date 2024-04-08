import React from "react";
import "./header.css";

const Header = ({ handleUploadPopupOpen }) => {
  return (
    <div className="header">
      <div className="header__logo">SNAPVILLE</div>

      <input className="header__search" type="text"></input>

      <div className="header__buttonContainer">
        <div
          className="buttonContainer__button"
          onClick={handleUploadPopupOpen}
        >
          Create a New Post
        </div>
        <div className="buttonContainer__button">Sign In</div>
        <div className="buttonContainer__button">Register</div>
        {/* TODO: more buttons go here */}
      </div>
    </div>
  );
};

export default Header;
