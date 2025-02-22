import { createContext, useState } from 'react';


interface AuthContextType {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
    userid: number;
    setUserId: (value: number) => void;
    username: string;
    setUsername: (value: string) => void;
}

const initialState = {
    loggedIn: false,
    setLoggedIn: () => {},
    userid: -1,
    setUserId: () => {},
    username: '',
    setUsername: () => {}
};

export const AuthContext = createContext<AuthContextType>(initialState);


export function AuthProvider({ children }: any) {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [userid, setUserId] = useState<number>(-1);
    const [username, setUsername] = useState<string>('');

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, userid, setUserId, username, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
}