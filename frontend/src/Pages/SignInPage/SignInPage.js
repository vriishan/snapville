import React from 'react'
import './signinpage.css'

const SignInPage = () => {
  return (
    <div className='signinPage'>
        <div className='signinPage__container'>
            <h1 className='container__header'>snapville</h1>
            <form className='container__form'>
            <input type='text' placeholder='Username' />
            <input type='password' placeholder='Password' />
            <button type='submit'>Sign In</button>
            </form>
        </div>
    </div>
  )
}

export default SignInPage