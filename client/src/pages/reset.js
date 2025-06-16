import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPasswordPage.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const missing = validatePassword(newPassword);
    if (missing.length > 0) {
      setErrorMessage(`Password requirements not met. Missing: ${missing.join(', ')}`);
      return;
    }

    try {
      await axios.post(`https://server-as46.onrender.com/auth/reset-password/${token}`, { newPassword });
      alert('Password reset successful! Please log in with your new password.');
      window.location.href = '/login';
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const missing = [];
    if (!/(?=.*[A-Z])/.test(password)) {
      missing.push('uppercase letter');
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      missing.push('special character');
    }
    if (!/(?=.*[0-9])/.test(password)) {
      missing.push('number');
    }
    if (password.length < 8) {
      missing.push('at least 8 characters');
    }
    return missing;
  };

  return (
    <div className='reset-container'>
      <h1>Password Reset</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">New Password:</label><br />
        <input
          type={showPassword ? 'text' : 'password'}
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password:</label><br />
        <input
          type={showPassword ? 'text' : 'password'}
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="button" onClick={togglePasswordVisibility}>
        {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        <span style={{ color: 'red' }}>{errorMessage}</span><br />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
