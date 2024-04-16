// ImageModal.js
import React, { useEffect } from "react";
import "./ImageModal.css";

const ImageModal = ({ imagePath, imageTitle, uname, tags, owner, closeModal, isTagSearch, tag }) => {
  useEffect(() => {
    const handleOverlayClick = async (event) => {
      if (!event.target.closest(".image-modal-content")) {
        closeModal();
        if (isTagSearch && tag !== undefined && tag !== null && tag !== "") {
          try {
            const response = await fetch(`http://127.0.0.1:8000/api/image/?tag=${encodeURIComponent(tag)}`);
            if (response.ok) {
              const data = await response.json();
              // Process the fetched data as needed
              // For example, you can update the UI with the new images
            } else {
              throw new Error("Failed to fetch images based on tag");
            }
          } catch (error) {
            console.error("Error fetching images based on tag:", error);
          }
        } else {
          window.location.reload();
        }
      }
    };

    document.addEventListener("mousedown", handleOverlayClick);

    return () => {
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [isTagSearch, tag]);

  const handleEditClick = () => {
    // Handle edit functionality here
  };

  return (
    <div className="image-modal-overlay">
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
        {(owner === sessionStorage.getItem("username")) && (
          <button className="edit-button" onClick={handleEditClick}>Edit</button>
        )}
        <img src={"http://localhost:8000/media" + imagePath} alt="Full Size" />
      </div>
    </div>
  );
};

export default ImageModal;
