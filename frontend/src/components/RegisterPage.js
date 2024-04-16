import React, { useState, useEffect } from 'react';
import './RegisterPage.css';

const RegisterPage = ({ setShowRegisterModal }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    username: ''
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('registerModal')) {
        setShowRegisterModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowRegisterModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, dateOfBirth, username } = formData;
    if (!firstName || !lastName || !email || !password || !confirmPassword || !dateOfBirth || !username) {
      alert('Please fill in all fields');
      return;
    }
    const currentDate = new Date();
    const selectedDate = new Date(dateOfBirth);
    if (selectedDate > currentDate) {
      alert('Date of Birth cannot be in the future');
      return;
    }
    const postData = {
      email_id: email,
      username: username,
      first_name: firstName,
      last_name: lastName,
      password: password,
      dob: dateOfBirth
    };
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert('Registration successful');
      setShowRegisterModal(false);
    } catch (error) {
      console.error('Error:', error.message);
      alert('Registration failed. Please try again later.');
    }
  };

  return (
    <div className='registerModal'>
      <div className='registerModal__container'>
        <h1 className='container__header'>snapville</h1>
        <form className='container__form' onSubmit={handleSubmit}>
          <input type='text' name='firstName' value={formData.firstName} onChange={handleChange} placeholder='First Name' />
          <input type='text' name='lastName' value={formData.lastName} onChange={handleChange} placeholder='Last Name' />
          <input type='email' name='email' value={formData.email} onChange={handleChange} placeholder='Email' />
          <input type='text' name='username' value={formData.username} onChange={handleChange} placeholder='Username' />
          <input type='password' name='password' value={formData.password} onChange={handleChange} placeholder='Password' />
          <input type='password' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder='Confirm Password' />
          <input type='date' name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} placeholder='Date of Birth' max={new Date().toISOString().split('T')[0]} />
          <button type='submit'>Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
