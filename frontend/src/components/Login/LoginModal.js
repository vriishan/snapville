import React, { useState, useEffect, useRef } from 'react';
import './LoginModal.css';
import { INTROSPECT_ENDPOINT, TOKEN_ENDPOINT } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { toast } from "react-toastify";
import StatusToast from '../StatusToast/StatusToast';

const LoginModal = ({ setShowLoginModal }) => {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLoginModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowLoginModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${TOKEN_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('username', username);

      // Now, make the second API call to get user data
      const userDataResponse = await fetch(`${INTROSPECT_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${data.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userDataResponse.ok) {
        const errorData = await userDataResponse.json();
        throw new Error(errorData.detail || 'Failed to get user data');
      }

      const userData = await userDataResponse.json();
      sessionStorage.setItem('userdata', JSON.stringify(userData));

      setCurrentUser(userData);
      setShowLoginModal(false);
      
      toast.success(<StatusToast message={`Successfully logged in as ${userData.username}`}/>);

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='loginModal'>
      <div className='loginModal__container' ref={modalRef}>
        <h1 className='container__header'>snapville</h1>
        <form className='container__form' onSubmit={handleSubmit}>
          <input type='text' name='username' value={formData.username} onChange={handleChange} placeholder='Username' />
          <input type='password' name='password' value={formData.password} onChange={handleChange} placeholder='Password' />
          <button type='submit'>Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginModal;
