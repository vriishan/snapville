import React from 'react';
import './ImagePage.css';
import { MEDIA_ENDPONT } from '../../utils/constants';

const ImagePage = ({ image }) => {
  return (
    <div className="image-page">
      <div className="image-header">
        <h1>{image.title}</h1>
      </div>
      <div className="image-content">
        <img src={`${MEDIA_ENDPONT}${image.path}`} alt={image.title} />
      </div>
      <div className="image-sidebar">
        <div className="image-metadata">
          <div>Uploaded by: {image.user.username}</div>
          <div>Size: {image.metadata.size}</div>
          <div>Resolution: {image.metadata.resolution}</div>
          <div>Views: {image.viewcount}</div>
          <div>Tags:</div>
          <ul>
            {image.tags.map(tag => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;