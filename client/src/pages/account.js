import React, { useState, useEffect } from 'react';
import '../styles/myaccountPage.css';
import profilePicture from '../assets/Picture1.png';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

const Account = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState({
        firstname: '',
        lastname: '',
        email: '',
        usergrp: '',
        id: '',
    });

    const navigate = useNavigate();
    const email = localStorage.getItem('userEmail'); // Email from localStorage

    const handleLogout = async () => {
        try {
            const result = await axios.post('https://server-as46.onrender.com/auth/logout');
            if (result.data.success) {
                localStorage.removeItem('userEmail'); // Optional: clear email
                navigate('/login');
            } else {
                console.error('Logout failed:', result.data.message);
            }
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://server-as46.onrender.com/auth/account/${email}`);
                if (response.data.length > 0) {
                    const userData = response.data[0];
                    setUsers({
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        email: userData.email,
                        id: userData.id,
                    });
                } else {
                    console.error("User data not found");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (email) {
            fetchUserData();
        } else {
            console.error("No user email found in localStorage");
            navigate('/login');
        }
    }, [navigate, email]);

    return (
        <div className="container2">
            <div className="account-page">
                <div className="profile">
                    <img src={profilePicture} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                </div>
                <h1 className="welcome"><strong>My Account</strong></h1>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <div className='firstname'>
                            <label className="first"><strong>FirstName:</strong></label>
                            <span className="bigger-text">{users.firstname}</span>
                            <br />
                        </div>
                        <div className='lastname'>
                            <label className="first"><strong>LastName:</strong></label>
                            <span className="bigger-text">{users.lastname}</span>
                            <br />
                        </div>
                        <div className='email1'>
                            <label className="email"><strong>Email Address:</strong></label>
                            <span className="bigger-text">{users.email}</span>
                            <br />
                        </div>
                    </div>
                )}

                <div>
                    <NavLink to="/forgot-password" className="password">Change password</NavLink>
                    <button className="logout1" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Account;
