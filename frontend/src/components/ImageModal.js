import React, { useState, useEffect } from "react";
import "./ImageModal.css";

const ImageModal = ({ imagePath, imageTitle, id, uname, tags, owner, closeModal, isTagSearch, tag }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedImageTitle, setUpdatedImageTitle] = useState(imageTitle);
  const [updatedTags, setUpdatedTags] = useState(tags.join(','));

  useEffect(() => {
    const handleOverlayClick = async (event) => {
      if (!event.target.closest(".image-modal-content")) {
        closeModal();
        if (isTagSearch && tag !== undefined && tag !== null && tag !== "") {
          try {
            const response = await fetch(`http://127.0.0.1:8000/api/image/?tag=${encodeURIComponent(tag)}`);
            if (response.ok) {
              const data = await response.json();
            } else {
              throw new Error("Failed to fetch images based on tag");
            }
          } catch (error) {
            console.error("Error fetching images based on tag:", error);
          }
        } else {
          window.location.reload(); // Reload the home page
        }
      }
    };

    document.addEventListener("mousedown", handleOverlayClick);

    return () => {
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [isTagSearch, tag, closeModal]);

  const handleEditClick = () => {
    setUpdatedImageTitle(imageTitle); // Reset to original title
    setUpdatedTags(tags.join(',')); // Reset to original tags
    setEditMode(true);
  };

  const handleUpdateImage = () => {
    // Convert updatedTags string to an array of tags
    const tagsArray = updatedTags.split(',').map(tag => tag.trim());

    // Prepare form data
    const formData = new FormData();
    console.log(updatedImageTitle+" "+tagsArray+" "+owner)
    formData.append("data", JSON.stringify({ title: updatedImageTitle, tags: tagsArray, owner: owner}));
    console.log(formData)

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
      body: formData, // Stringify the data
      redirect: "follow"
    };

    fetch(`http://127.0.0.1:8000/api/$update-image/${id}/`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // Reload home page upon successful update
        window.location.reload();
      })
      .catch((error) => console.error("Error updating image:", error));
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  return (
    <div className="image-modal-overlay">
      <div className="image-modal-content">
        <div className="image-details">
          {!editMode && (
            <>
              <span className="image-title">{imageTitle}</span>
              <span className="image-username">{uname}</span>
              <div className="image-tags">
                {tags.map((tag, index) => (
                  <span key={index} className="image-tag">{tag}</span>
                ))}
              </div>
            </>
          )}
          {editMode && (
            <>
              <label htmlFor="imageTitle">Image Name:</label>
              <input id="imageTitle" type="text" value={updatedImageTitle} onChange={(e) => setUpdatedImageTitle(e.target.value)} className="form-input" />
              <label htmlFor="imageTags">Image Tags:</label>
              <input id="imageTags" type="text" value={updatedTags} onChange={(e) => setUpdatedTags(e.target.value)} className="form-input" />
            </>
          )}
        </div>
        {(owner === sessionStorage.getItem("username")) && (
          <>
            {editMode ? (
              <div className="button-group">
                <button className="update-button" onClick={handleUpdateImage}>Update</button>
                <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <button className="edit-button" onClick={handleEditClick}>Edit</button>
            )}
          </>
        )}
        <img src={"http://localhost:8000/media" + imagePath} alt="Full Size" />
      </div>
    </div>
  );
};

export default ImageModal;
