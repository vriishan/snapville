import React, { useState, useEffect } from "react";
import "./ImageGrid.css";
import ImageModal from "./ImageModal";

const ImageItem = ({ image, openModal }) => {
  return (
    <div className="image-item-container" onClick={() => openModal(image)}>
      <img src={"http://localhost:8000/media" + image.thumbnail_path} alt={image.title} />
      <div className="image-details">
        <span className="image-title">{image.title}</span>
        <div className="view-count">
          <i className="fas fa-eye view-icon"></i>
          <span>{image.viewcount}</span>
        </div>
      </div>
    </div>
  );
};

const ImageGrid = ({ images, tag, isLoggedIn }) => {
  const [modalImage, setModalImage] = useState(null);
  const [fullImage, setFullImage] = useState(null);
  const [modalImageTitle, setModalImageTitle] = useState("");
  const [username, setUsername] = useState("");
  const [tags,setTags]=useState([]);
  const [isTagSearch, setIsTagSearch] = useState(false);
  const [owner, setOwner] = useState("");

  useEffect(() => {
    const fetchFullImage = async () => {
      if (modalImage) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/image/${modalImage.id}/`);
          if (response.ok) {
            const data = await response.json();
            setFullImage(data.path);
            setModalImageTitle(modalImage.title);
            setUsername(data.user.username);
            setTags(data.tags);
            setOwner(data.owner);
          } else {
            throw new Error("Failed to fetch full-size image");
          }
        } catch (error) {
          console.error("Error fetching full-size image:", error);
        }
      }
    };

    fetchFullImage();
  }, [modalImage]);

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
    setFullImage(null);
    setModalImageTitle("");
  };

  useEffect(() => {
    setIsTagSearch(tags.length > 0);
  }, [tags]);

  return (
    <div className="image-grid">
      {images.map((image) => (
        <ImageItem key={image.id} image={image} openModal={openModal} />
      ))}
      {modalImage && (
        <ImageModal
          imagePath={fullImage}
          imageTitle={modalImageTitle}
          uname={username}
          owner={owner}
          tags={tags}
          tag={tag}
          closeModal={closeModal}
          isTagSearch={isTagSearch}
          isLoggedIn={isLoggedIn} // Pass isLoggedIn to ImageModal
        />
      )}
    </div>
  );
};

export default ImageGrid;
