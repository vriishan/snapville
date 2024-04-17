import React, { useState, useEffect } from "react";
import "./HomePage.css";
import UploadPopup from "./../../components/Upload/UploadPopup"; // Import UploadPopup component
import ImageGrid from "./../../components/ImageGrid/ImageGrid";
import Background from "./../../Background";
import ImageModal from "./../../components/ImageGrid/ImageModal";
import * as Constants from './../../utils/constants'
import { useSearch } from "../../context/SearchProvider";


function HomePage() {
  const [openUploadPopup, setOpenUploadPopup] = useState(false);
  const [noImagesTextValue, setNoImagesTextValue] = useState("No images to show");
  const { searchTerm } = useSearch();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [searchTerm]);

  useEffect(() => {
    if (images.length === 0) {
      if (searchTerm) {
        setNoImagesTextValue(`No images to show for '${searchTerm}'`);
      } else {
        setNoImagesTextValue("No images to show");
      }
    }
  }, [images, searchTerm]);

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
    <div>
      {/* <Background /> */}
      {openUploadPopup && <UploadPopup handleUploadPopupClose={handleUploadPopupClose} />} {/* Include UploadPopup */}
      {images.length > 0 && <ImageGrid images={images} onImageClick={handleImageClick} />}
      {images.length == 0 && !isLoading && <div className="noImagesText">{noImagesTextValue}</div>}
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
