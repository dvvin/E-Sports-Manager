import React, { useContext, useState } from 'react';
import './Login.css';
import '../Navbar/Navbar'
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContextTest } from './CurrentUserContext';

function Login() {
    const [showRegistration, setShowRegistration] = useState(false);

    const toggleRegistration = () => {
        setShowRegistration(!showRegistration);
    };

    return (
        <><Navbar /><div className="login-container">
            {showRegistration ? (
                <RegisterPage toggleRegistration={toggleRegistration} />
            ) : (
                <LoginPage toggleRegistration={toggleRegistration} />
            )}
        </div></>
    );
}

function LoginPage({ toggleRegistration }) {
    const navigate = useNavigate();
    const [message, setMessage] = useState(""); // Add this line

    // set the current user and pass to CurrentUserContext
    const { currentUser, setCurrentUser } = useContext(UserContextTest);

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post('http://localhost:4000/user/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role); // get role from database
            localStorage.setItem('username', response.data.username); // get username from database
            setMessage(response.data.message);
            setCurrentUser(username);
            localStorage.setItem('current_user', currentUser)
            console.log(username);
            navigate('/');
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.error
                ? err.response.data.error
                : 'An error occurred while logging in.';
            setMessage(errorMessage);
        }
    };

    return (
        <>
            <h1>Login</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <button type="submit" className='login-btn'>Login</button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Don't have an account?
                <span
                    role="button"
                    onClick={toggleRegistration}
                    style={{ marginLeft: '5px', textDecoration: 'underline', cursor: 'pointer' }}>
                    Create Account
                </span>
            </p>
        </>
    );
}

function RegisterPage({ toggleRegistration }) {
    const [message, setMessage] = useState("");

    const handleRegistration = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const username = e.target.fullName.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post('http://localhost:4000/user/register', { email, username, password });
            setMessage(response.data.message);
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.error
                ? err.response.data.error
                : 'An error occurred while registering.';
            setMessage(errorMessage);
        }
    };

    return (
        <>
            <h1>Create Account</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleRegistration}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="fullName">Username:</label>
                <input type="text" id="fullName" name="fullName" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required />

                <button type="submit">Create Account</button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Already have an account?
                <span
                    role="button"
                    onClick={toggleRegistration}
                    style={{ marginLeft: '5px', textDecoration: 'underline', cursor: 'pointer' }}>
                    Log In
                </span>
            </p>
        </>
    );
}

export default Login;
