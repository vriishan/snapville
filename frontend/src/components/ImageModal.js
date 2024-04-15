import React, { useEffect } from "react";
import "./ImageModal.css";

const ImageModal = ({ imagePath, imageTitle, uname, tags, closeModal, isTagSearch, tag }) => {
  useEffect(() => {
    console.log(isTagSearch+" "+tag)
    const handleOverlayClick = async () => {
      if (isTagSearch && tag) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/image/?tag=${encodeURIComponent(tag)}`);
          if (response.ok) {
            const data = await response.json();
            // Reload the page with the tag parameter
            window.location.href = `/?tag=${encodeURIComponent(tag)}`;
          } else {
            throw new Error("Failed to fetch images based on tag");
          }
        } catch (error) {
          console.error("Error fetching images based on tag:", error);
        }
      } else {
        // If images are not loaded based on a tag search or the tag does not exist, simply reload the page
        window.location.reload();
      }
    };

    document.addEventListener("mousedown", handleOverlayClick);

    return () => {
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [isTagSearch, tag]);

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
        <img src={"http://localhost:8000/media" + imagePath} alt="Full Size" />
      </div>
    </div>
  );
};

export default ImageModal;
