import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState();
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [type, setType] = useState();

    const login = useCallback((type, token, expirationDate) => {
        setType(type);
        setToken(token);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 3600000);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                type,
                token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, [])

    const logout = useCallback(() => {
        setType(null);
        setToken(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData');
    }, [])

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        }
        else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('userData'));
        if (data && data.token && new Date(data.expiration) > new Date()) {
            login(data.type, data.token, new Date(data.expiration));
        }
    }, [login])

    return { token, type, login, logout };
}