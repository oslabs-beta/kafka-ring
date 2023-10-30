/*
 * *************************************
 *
 * @module  Login.jsx
 * @author MichaelNewbold, jensenrs
 * @date 10/28/2023
 * @description Login container
 *
 * ************************************
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../scss/login.scss';

import {
  switchAuth,
  setEmail,
  setPassword,
  setUsername,
  setPassMatch,
} from '../reducers/authReducer.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);

  useEffect(() => {
    async function verifySession() {
      const response = await fetch('/users');
      if (response.status === 200) {
        navigate('/main');
      }
    }
    verifySession();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const loginEndpoint = `/users/${login.authType}`;
    const username = login.username;
    const password = login.password;
    let confirmPassword;
    if (login.authType === 'login') {
      try {
        const response = await fetch(loginEndpoint, {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
          }),
          headers: {
            
          }
        });
      } catch (error) {
        return `Error in loginn attempt. Check usename or password. ${error}`;
      }
    }
  };

  if (login.authType === 'login') {
    return (
      <>
        <h1 className='kurrentTitle'>Kurrent</h1>
        <div className='login-container'>
          <form action='' className='submit-form'>
            <input
              type='text'
              className='username'
              placeholder='username / email'
              autoComplete='off'
              onChange={(e) => dispatch(setUsername(e.target.value))}
            />
            <br />
            <input
              type='password'
              className='password'
              placeholder='password'
              autoComplete='off'
              onChange={(e) => dispatch(setPassword(e.target.value))}
            />
            <button
              id='login'
              className='loginBtns'
              type='submit'
              onClick={(e) => handleFormSubmit(e.target.value)}
            >
              Login
            </button>
            <a
              id='signup'
              className='loginBtns'
              type='submit'
              onClick={() => dispatch(switchAuth())}
            >
              Don't have an Account?
            </a>
          </form>
        </div>
      </>
    );
  } else {
    return (
      <>
        <h1 className='signUpTitle'>Sign Up</h1>
        <div className='login-container'>
          <form action='' className='submit-form' id='signUpForm'>
            <input
              type='text'
              className='username'
              placeholder='email'
              autoComplete='off'
              onChange={(e) => dispatch(setEmail(e.target.value))}
            />
            <br />
            <input
              type='text'
              className='username'
              placeholder='username'
              autoComplete='off'
              onChange={(e) => dispatch(setUsername(e.target.value))}
            />
            <br />
            <input
              type='password'
              className='password'
              placeholder='password'
              autoComplete='off'
              onChange={(e) => dispatch(setPassword(e.target.value))}
            />
            <input
              type='password'
              className='password'
              placeholder='confirm password'
              autoComplete='off'
              onChange={(e) => dispatch(setPassMatch(e.target.value))}
            />
            <button
              id='login'
              className='loginBtns'
              type='submit'
              onClick={() => dispatch(handleFormSubmit())}
              disabled={!login.passMatch}
            >
              Create Account
            </button>
          </form>
        </div>
      </>
    );
  }
};

export default Login;
