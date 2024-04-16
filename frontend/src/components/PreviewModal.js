import React, { useState } from "react";
import "./previewModal.css";

const PreviewModal = ({
  image,
  imageName,
  imageTags,
  id,
  handleClose,
  handleUpload,
  handleNameChange,
  handleTagChange,
  isEdit // Boolean flag for edit mode
}) => {
  const [updatedImage, setUpdatedImage] = useState(null);

  const handleUpdateImage = () => {
    // Prepare form data
    const formData = new FormData();
    formData.append("image", updatedImage);
    formData.append("data", JSON.stringify({ title: imageName, tags: imageTags }));

    // Send PUT request to update image
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token not found in storage");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formData,
      redirect: "follow"
    };

    fetch(`http://127.0.0.1:8000/api/$update-image/${id}/`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // Handle success, close modal or trigger actions
        handleClose();
      })
      .catch((error) => console.error("Error updating image:", error));
  };

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
        {/* If in edit mode, show update button */}
        {isEdit && (
          <button className="previewModal__button" onClick={handleUpdateImage}>
            Update Image
          </button>
        )}
        {/* If not in edit mode, show upload button */}
        {!isEdit && (
          <button className="previewModal__button" onClick={handleUpload}>
            Upload Image
          </button>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
