import React from "react";
import "./ImageModal.css";

const ImageModal = ({ imagePath, imageTitle, uname, tags, closeModal }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("image-modal-overlay")) {
      window.location.reload();
    }
  };

  return (
    <div className="image-modal-overlay" onClick={handleOverlayClick}>
      <div className="image-modal-content">
        <div className="image-details">
          <span className="image-title">{imageTitle}</span>
          <span className="image-username">{uname}</span>
          <div className="image-tags">
            {tags.map((tag, index) => (
              <span key={index} className="image-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <img src={"http://localhost:8000/media" + imagePath} alt="Full Size" />
      </div>
    </div>
  );
};

export default ImageModal;
