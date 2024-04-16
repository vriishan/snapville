import React, { useState, useEffect, useRef } from 'react';
import './LoginPage.css';

const LoginPage = ({ setIsLoggedIn, setShowLoginModal }) => {
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
      const response = await fetch('http://127.0.0.1:8000/api-token-auth/', {
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
        throw new Error(errorData.detail);
      }

      const data = await response.json();
      // Save token and username to local storage
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('username', username);
      setIsLoggedIn(true);
      setShowLoginModal(false);
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

export default LoginPage;
