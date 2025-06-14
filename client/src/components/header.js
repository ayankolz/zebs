import React from 'react';
import '../styles/header.css';
import logoIcon from '../assets/download.jpeg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');

const handleLogout = () => {
  axios.post('http://localhost:3005/auth/logout')
    .then(result => {
      if (result.data.success) {
        localStorage.removeItem('userEmail');
        navigate('/login');
      } else {
        console.error('Logout failed:', result.data.message);
        // Optionally: Show an error message to the user
      }
    })
    .catch(err => {
      console.error('Error logging out:', err);
      // Optionally: Show an error message to the user
      // setError('Failed to logout. Please try again.');
    });
};


  return (
    <div className='header'>
      <section>
        <div className='navbar'>
          <table className='header-table'>
            <tbody>
              <tr className='header-row'>
                <th>
                  <a href="/advance">
                    <img src={logoIcon} alt='Logo' className='logo'/>
                  </a>
                </th>
                <th>
                  <a href="/advance" className='link'>
                    <span className="expense">SMART IRRIGATION</span><br />
                    <span className="system">SYSTEM</span>
                  </a>
                </th>
                <th>
                  <button className="logout" onClick={handleLogout}>Logout</button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Header;
