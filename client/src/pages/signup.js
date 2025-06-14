import React, { useState } from "react";
import '../styles/Signup-page.css'; // Create this CSS file similarly to your login CSS
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [values, setValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3005/auth/register', values)
            .then(res => {
                if (res.data.success) {
                    navigate('/login'); // Redirect to login on success
                } else {
                    setError(res.data.message || 'Sign-up failed.');
                }
            })
            .catch(err => {
                console.error(err);
                setError('An error occurred. Please try again.');
            });
    };

    return (
        <div className="signup-container">
            <h2>Create an Account</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={values.firstname}
                    onChange={e => setValues({ ...values, firstname: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={values.lastname}
                    onChange={e => setValues({ ...values, lastname: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={e => setValues({ ...values, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={e => setValues({ ...values, password: e.target.value })}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <span onClick={() => navigate('/login')} className="link">Login</span></p>
        </div>
    );
};

export default Signup;
