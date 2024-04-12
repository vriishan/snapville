import React, { useState, useEffect } from 'react';
import './LoginPage.css';

const LoginPage = ({ setIsLoggedIn, setShowLoginModal }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('loginModal')) {
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
      alert('Please fill in all fields');
      return;
    }
    // You can add your login logic here
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  return (
    <div className='loginModal'>
      <div className='loginModal__container'>
        <h1 className='container__header'>snapville</h1>
        <form className='container__form' onSubmit={handleSubmit}>
          <input type='text' name='username' value={formData.username} onChange={handleChange} placeholder='Username' />
          <input type='password' name='password' value={formData.password} onChange={handleChange} placeholder='Password' />
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
