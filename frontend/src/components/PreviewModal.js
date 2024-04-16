import React from "react";
import "./previewModal.css";

const PreviewModal = ({
  image,
  imageName,
  imageTags,
  handleClose,
  handleUpload,
  handleNameChange,
  handleTagChange,
}) => {
  return (
    <div className="previewModal__overlay">
      <div className="previewModal__content">
        <span className="previewModal__close" onClick={handleClose}>
          &times;
        </span>
        <div className="previewModal__imageContainer">
          <img src={image} alt="Preview" className="previewModal__image" />
        </div>
        <div className="previewModal__inputContainer">
          <input
            type="text"
            placeholder="Enter image name"
            value={imageName}
            onChange={handleNameChange}
            className="previewModal__input"
          />
          <input
            type="text"
            placeholder="Enter tags separated by commas"
            value={imageTags.join(",")}
            onChange={handleTagChange}
            className="previewModal__input"
          />
        </div>
        <button className="previewModal__button" onClick={handleUpload}>
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default PreviewModal;
