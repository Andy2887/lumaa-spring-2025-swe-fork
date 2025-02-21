import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setLoggedIn } = useContext(AuthContext);


    async function login(ev : React.FormEvent){
        ev.preventDefault();
        try{
            const response = await fetch('http://localhost:3005/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password}),
                credentials: 'include' // In this way, if we have a cookie, it will be included in the browser
            });
            const data = await response.json();
            if (response.status !== 200){
                setError(data.message || 'Login failed');
            }
            else{
                setError('');
                setLoggedIn(true);
                navigate('/tasks');
            }

        }catch(e){
            setError('An error occurred during login');
        }
    }

    return (
        <div className="auth-container" onSubmit={login}>
            <form className="auth-form">
                <h2>Welcome Back</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type = "text" id = "username" placeholder = "Username" value = {username} onChange = {ev => setUsername(ev.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type = "password" id = "password" placeholder = "Password" value = {password} onChange = {ev => setPassword(ev.target.value)}/>
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="auth-button">Login</button>
                <div className="auth-links">
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
        </div>
    )
}