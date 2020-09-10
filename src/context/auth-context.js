import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    type: null,
    login: () => {},
    logout: () => {},
});