import React, { useState, useEffect } from "react";
import "./HomePage.css";
import UploadPopup from "./../../components/Upload/UploadPopup"; // Import UploadPopup component
import ImageGrid from "./../../components/ImageGrid/ImageGrid";
import Background from "./../../Background";
import ImageModal from "./../../components/ImageGrid/ImageModal";
import * as Constants from './../../utils/constants'
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchProvider";

function HomePage() {
  const [openUploadPopup, setOpenUploadPopup] = useState(false);
  const { currentUser, logout } = useAuth();
  const { searchTerm } = useSearch();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        let imageUrl = `${Constants.IMAGE_ENDPOINT}`
        if (searchTerm) {
          imageUrl = `${imageUrl}?tag=${searchTerm}`
        }
        const response = await fetch(`${imageUrl}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          setImages([]);
          throw new Error("Failed to fetch images");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [searchTerm]);

  const handleUploadPopupClose = () => {
    setOpenUploadPopup(false);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="App">
      <Background />
      {openUploadPopup && <UploadPopup handleUploadPopupClose={handleUploadPopupClose} />} {/* Include UploadPopup */}
      <ImageGrid images={images} onImageClick={handleImageClick} />
      {selectedImage && (
        <ImageModal
          imagePath={selectedImage.path}
          username={selectedImage.owner}
          title={selectedImage.title}
          closeModal={handleCloseModal}
        />
      )}
    </div>
  );
}

export default HomePage;
