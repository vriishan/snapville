import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import UploadPopup from "./components/UploadPopup"; // Import UploadPopup component
import ImageGrid from "./components/ImageGrid";
import Background from "./Background";
import ImageModal from "./components/ImageModal";

function App() {
  const [openUploadPopup, setOpenUploadPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [images, setImages] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Check if a token exists in local storage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchImages = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/image/");
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          throw new Error("Failed to fetch images");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleUploadPopupClose = () => {
    setOpenUploadPopup(false);
  };

  const handleUploadPopupOpen = () => {
    setOpenUploadPopup(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Remove the token from local storage on logout
    localStorage.removeItem("token");
  };

  const handleSearch = async (tag) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/image/?tag=${tag}`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        throw new Error("Failed to fetch images with tag:", tag);
      }
    } catch (error) {
      console.error("Error fetching images with tag:", tag, error);
    }
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
      <Header
        handleUploadPopupOpen={handleUploadPopupOpen}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        setShowRegisterModal={setShowRegisterModal}
        setShowLoginModal={setShowLoginModal}
        handleSearch={handleSearch}
      />
      {showRegisterModal && <RegisterPage setShowRegisterModal={setShowRegisterModal} />}
      {showLoginModal && (
        <LoginPage setIsLoggedIn={setIsLoggedIn} setShowLoginModal={setShowLoginModal} />
      )}
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

export default App;
