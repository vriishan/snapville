import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // assuming you are using react-bootstrap
import './EditModal.css';

const EditModal = ({ image, updateImage, handleModalClose }) => {
  const [showModal, setShowModal] = useState(true);
  const [title, setTitle] = useState(image.title);
  const [tags, setTags] = useState(image.tags.join(', '));

  const handleSave = () => {
    const processedTags = tags.split(',').map(item => item.trim());
    updateImage(title, processedTags);
    handleModalClose();
  };

  return (
      <Modal show onHide={() => handleModalClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Image Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} />
          <label>Tags</label>
          <input value={tags} onChange={e => setTags(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default EditModal;
