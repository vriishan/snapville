// UploadPopup.js
import React, { useState } from "react";
import PreviewModal from './../Preview/PreviewModal'
import "./UploadPopup.css";

const UploadPopup = ({ handleUploadPopupClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageTags, setImageTags] = useState([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      setSelectedImage(imageFile);
      setSelectedImagePath(e.target.result);
      setPreviewModalOpen(true);
    };

    reader.readAsDataURL(imageFile);
  };

  const handleNameChange = (event) => {
    setImageName(event.target.value);
  };

  const handleTagChange = (event) => {
    const tags = event.target.value.split(",").map((tag) => tag.trim());
    setImageTags(tags);
  };

  const handlePreviewModalClose = () => {
    setPreviewModalOpen(false);
  };

  const handleImageUpload = () => {
    console.log("Selected Image:", selectedImage);
    console.log("Image Name:", imageName);
    console.log("Image Tags:", imageTags);

    // Check if all necessary data is available
    if (!selectedImage || !imageName || !imageTags) {
      console.error("Missing required data for image upload");
      return;
    }

    // get owner details for the form
    const owner = sessionStorage.getItem('username');
    if (!owner) {
      console.error("current user's username not found in storage");
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("data", JSON.stringify({ title: imageName, tags: imageTags, owner: owner}));

    console.log("Form Data:", formData);

    // Send POST request to upload image
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("token not found in storage");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow"
    };

    fetch("http://127.0.0.1:8000/api/$upload-image/", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // Handle success
        // You can add any further actions here after successful upload
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="uploadPopup">
      <div className="uploadPopup__box">
        <div className="box__close" onClick={handleUploadPopupClose}>
          X
        </div>
        <h3 className="box__heading">Upload Image</h3>
        <div className="uploadBox">
          <label htmlFor="fileInput" className="file-label">
            <div className="drag">
              <div className="dropText">Drop your file here or</div>
              <div className="browse">Browse</div>
            </div>
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>
      {previewModalOpen && (
        <PreviewModal
          image={selectedImagePath}
          imageName={imageName}
          imageTags={imageTags}
          handleClose={handlePreviewModalClose}
          handleUpload={handleImageUpload}
          handleNameChange={handleNameChange}
          handleTagChange={handleTagChange}
        />
      )}
    </div>
  );
};

export default UploadPopup;
