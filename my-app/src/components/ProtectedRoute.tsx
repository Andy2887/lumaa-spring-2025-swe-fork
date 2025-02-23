import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useContext, useEffect, useState} from 'react';

export const ProtectedRoute = ( { children } : any ) =>{
    const { loggedIn, setLoggedIn, setUserId, setUsername } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function checkLoggedIn() {
            try{
                const response = await fetch('http://localhost:3005/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
    
    
                if (response.status === 200) {
                    const data = await response.json();
                    setLoggedIn(true);
                    setUserId(data.userid);
                    setUsername(data.username);
                }
                else {
                    setLoggedIn(false);
                    setUserId(-1);
                    setUsername('');
                }
            }
            catch (error) {
                console.error('Error checking if user is logged in');
            }
            finally {
                setLoading(false);
            }
        }
        checkLoggedIn();
    }
    , [setLoggedIn, setUserId, setUsername]);

    if (loading) {
        return <div>Loading...</div>;
    }


    return loggedIn ? children : <Navigate to="/login" />;

};