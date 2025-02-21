import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useContext } from 'react';

export const ProtectedRoute = ( { children } : any ) =>{
    const { loggedIn } = useContext(AuthContext);

    if (!loggedIn){
        return <Navigate to ="/login" />;
    }

    return children;

};