import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';


export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function register(ev : React.FormEvent){
        ev.preventDefault();
        try{
            const response = await fetch('http://localhost:3005/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            });

            const data = await response.json();

            if (response.status !== 200) {
                setError(data.message || 'Registration failed');
            } else {
                setError('');
                navigate('/');
            }

        }catch(e){
            setError('An error occurred during registration');
        }
        

    }

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={register}>
                <h2>Create Account</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" placeholder="Username" value = {username} onChange = {ev => setUsername(ev.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Password" value = {password} onChange = {ev => setPassword(ev.target.value)}/>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type = "submit" className="auth-button">Register</button>
                <div className="auth-links">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
    )
}