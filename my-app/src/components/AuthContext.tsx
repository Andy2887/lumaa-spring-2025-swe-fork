import { createContext, useState } from 'react';


interface AuthContextType {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
}

const initialState = {
    loggedIn: false,
    setLoggedIn: () => {},
};

export const AuthContext = createContext<AuthContextType>(initialState);


export function AuthProvider({ children }: any) {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}