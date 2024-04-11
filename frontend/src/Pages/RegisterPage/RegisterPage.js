import React from 'react'
import './registerpage.css'

const RegisterPage = () => {
  return (
    <div className='registerPage'>
        <div className='registerPage__container'>
            <h1 className='container__header'>snapville</h1>
            <form className='container__form'>
            <input type='text' placeholder='Username' />
            <input type='email' placeholder='Email' />
            <input type='password' placeholder='Password' />
            <input type='password' placeholder='Confirm Password' />
            <button type='submit'>Register</button>
            </form>
        </div>
    </div>
  )
}

export default RegisterPage