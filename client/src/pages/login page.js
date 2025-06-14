import React, { useState } from "react";
import '../styles/Login-page.css';
import ClastelLogo from '../assets/download.jpeg';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3005/auth/Login', values)
            .then(result => {
                if (result.data.loginStatus) {
                    // Save email to localStorage
                    localStorage.setItem('userEmail', values.email);

                    // Navigate to the next page
                    navigate('/advance');
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => {
                console.error("Login error:", err);
                setError("Something went wrong. Please try again.");
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="body1">
            <div className="login-container">
                <div className="error">
                    {error && error}
                </div>
                <img src={ClastelLogo} alt="logo" className="logo" />
                <div className="words">
                    <span className="expense">SMART IRRIGATION</span><br />
                    <span className="system">SYSTEM</span>
                </div>

                <h4 className="login">LOGIN</h4>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="email"
                        className="userbox"
                        placeholder="Email"
                        required
                        value={values.email}
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                    />
                    <div className="any">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="password-box"
                            placeholder="Password"
                            required
                            value={values.password}
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                        />
                        <button 
                            type="button" 
                            className="toggle-password"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="login-actions">
                        <button 
                            type="button" 
                            className="newuserbtn" 
                            onClick={() => navigate('/forgot-password')}
                        >
                            Forgot Password
                        </button>
                        <button 
                            type="button" 
                            className="signupbtn" 
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </div> 
                    <button 
                        type="submit"
                        className="submitbutton"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
