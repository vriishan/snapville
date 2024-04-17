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
        <Modal.Title className="modal-title">Edit Image Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label className="modal-label">Title</label>
        <input
          className="modal-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label className="modal-label">Tags (separated by commas)</label>
        <input
          className="modal-input"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose} className="modal-footer-button">
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} className="modal-footer-button">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
