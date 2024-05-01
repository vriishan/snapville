import React from 'react';
import './ImagePage.css';
import { API_BASE_URL, IMAGE_ENDPOINT, MEDIA_ENDPONT } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { faShareAlt, faEdit, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditModal from '../../components/Edit/EditModal';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import StatusToast from '../../components/StatusToast/StatusToast';

const ImagePage = () => {
    const [image, setImage] = useState(null);
    const { imageId } = useParams();
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false)
    const { currentUser } = useAuth();

    const handleGoBack = () => {
        navigate(-1);  // This will take you back to the previous page
    };

    const getFormattedDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleDateString("en-US", {
          year: 'numeric', month: 'long', day: 'numeric', // These options are for a more verbose date format
          hour: '2-digit', minute: '2-digit', second: '2-digit' // This will include time as well
        });
    };

    const handleShare = () => {
        navigator.share({ url: image.path })
      };
    
    // Function to handle the download action
    const handleDownload = () => {
        fetch(`${MEDIA_ENDPONT}${image.path}`)
        .then(response => response.blob())
        .then(blob => {
        // Create a new object URL for the image blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create a link and set the object URL as the href
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = image.title || 'download'; // If image.title is not set, fallback to 'download'

        // Append the link, trigger the download, and then remove the link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the object URL after the download
        URL.revokeObjectURL(blobUrl);
        })
        .catch(e => console.error('Download failed', e));
    };

    const handleEdit = () => {
        setShowEditModal(prev => !prev)
    }

    const handleDelete = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(`${IMAGE_ENDPOINT}${imageId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`, // Assuming a Bearer token type
                },
            });
    
            if (response.ok) {
                toast.success(<StatusToast message={`Image deleted successfully`}/>);
                navigate(-1); // Optionally navigate back after deletion
            } else {
                toast.error(<StatusToast message={`Error deleting image: ${JSON.stringify(response.error)}`}/>);
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error(<StatusToast message={`Error deleting image: ${JSON.stringify(error)}`}/>);
        }
    };

    const handleUpdate = async (title, tags) => {
        const token = sessionStorage.getItem('token');

        const owner = image.owner;

        const formData = new FormData();
        formData.append("data", JSON.stringify({ title: title, tags: tags, owner: owner}));

        try {
            const response = await fetch(`${API_BASE_URL}/$update-image/${imageId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`, // Assuming a Bearer token type
                },
                body: formData
            });
    
            if (response.ok) {
                setImage(prevImage => {
                    return { ...prevImage, title: title, tags: tags };
                });
                toast.success(<StatusToast message={`Updated image successfully`}/>);
            } else {
                throw new Error('Failed to update the image');
            }
        } catch (error) {
            console.error("Error updating image:", error);
            toast.success(<StatusToast message={`Error updating image: ${JSON.stringify(error)}`}/>);
        }
    }

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(`${IMAGE_ENDPOINT}${imageId}/`);
                if (response.ok) {
                    const data = await response.json();
                    setImage(data);
                } else {
                    throw new Error("Failed to fetch image");
                }
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        fetchImage();
    }, [imageId]);

    if (!image) {
        return <div>Loading...</div>; // Or any other loading state representation
    }

    return (
        <div className="image-page">
            <div className="back-button" onClick={handleGoBack}>
                <FaArrowLeft /> {/* This is the arrow icon */}
            </div>
            <div className="image-header">
                <div>
                    <h1>{image.title}</h1>
                    <p>Uploaded by: {image.user.username}</p>
                </div>
                <div className="image-header-icons">
                    {currentUser && currentUser.email_id === image.owner && <FontAwesomeIcon icon={faEdit} onClick={handleEdit} className="icon-button" title="Edit" />}
                    <FontAwesomeIcon icon={faShareAlt} onClick={handleShare} className="icon-button" title="Share" />
                    <FontAwesomeIcon icon={faDownload} onClick={handleDownload} className="icon-button" title="Download" />
                    {currentUser && (currentUser.is_admin || currentUser.email_id === image.owner) && <FontAwesomeIcon icon={faTrash} onClick={handleDelete} className="icon-button" title="Delete" />}
                </div>
            </div>
            <div className="image-tags">
                <div>Tags: </div>
                <ul>
                    {image.tags.map(tag => (
                        <li key={tag}>{tag}</li>
                    ))}
                </ul>
            </div>
            <div className="image-container">
                <div className="image-content">
                    <img src={`${MEDIA_ENDPONT}${image.path}`} alt={image.title} />
                </div>
                <div className="image-sidebar">
                    <div className="image-metadata">
                        <div><b>Uploaded on:</b> {getFormattedDate(image.metadata.uploaded_on)}</div>
                        <div><b>File Size:</b> {image.metadata.size}</div>
                        <div><b>Resolution:</b> {image.metadata.resolution}</div>
                        <div><b>Views:</b> {image.viewcount}</div>
                        <div><b>Image Extension:</b> {image.metadata.file_type}</div>
                    </div>
                </div>
            </div>
            {showEditModal && (
                <EditModal
                image={image}
                updateImage={handleUpdate}
                // Pass a function to control the visibility from the ParentComponent
                handleModalClose={() => setShowEditModal(false)}
                />
            )}
        </div>
    );
};


export default ImagePage;