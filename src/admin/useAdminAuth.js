import { useState, useEffect } from 'react';
const ADMIN_SESSION_KEY = 'addis_eats_admin_session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
let inactivityTimeout;

export function getAdminSession() {
    try {
        const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (!session) {
            return null;
        }
        const parsed = JSON.parse(session);

        if (parsed.loggedInAt) {
            const loggedInTime = new Date(parsed.loggedInAt).getTime();
            const now = Date.now();
            if (now - loggedInTime > SESSION_TIMEOUT_MS) {
                sessionStorage.removeItem(ADMIN_SESSION_KEY);
                window.dispatchEvent(new Event('admin-auth-changed'));
                return null;
            }
        }

        return parsed;
    }
    catch {
        return null;
    }
}

export function setAdminSession(user) {
    if (user) {
        const sessionData = {
            ...user,
            loggedInAt: new Date().toISOString(),
        };
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    }
    else {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        localStorage.removeItem('addis_eats_admin_session');
    }
    window.dispatchEvent(new Event('admin-auth-changed'));
}

export function useAdminAuth() {
    const [admin, setAdmin] = useState(getAdminSession);
    useEffect(() => {
        const handleUpdate = () => {
            setAdmin(getAdminSession());
        };
        window.addEventListener('admin-auth-changed', handleUpdate);
        window.addEventListener('storage', handleUpdate);

        const resetTimeout = () => {
            clearTimeout(inactivityTimeout);
            if (getAdminSession()) {
                inactivityTimeout = setTimeout(() => {
                    setAdminSession(null);
                    setAdmin(null);
                }, SESSION_TIMEOUT_MS);
            }
        };

        window.addEventListener('mousemove', resetTimeout);
        window.addEventListener('keydown', resetTimeout);
        window.addEventListener('click', resetTimeout);

        return () => {
            window.removeEventListener('admin-auth-changed', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
            window.removeEventListener('mousemove', resetTimeout);
            window.removeEventListener('keydown', resetTimeout);
            window.removeEventListener('click', resetTimeout);
            clearTimeout(inactivityTimeout);
        };
    }, []);
    const login = (username, pass) => {
        if ((username === 'admin' && pass === 'admin123') || (username === 'staff' && pass === 'staff123')) {
            const user = {
                username,
                role: username === 'admin' ? 'admin' : 'manager',
                loggedInAt: new Date().toISOString(),
            };
            setAdminSession(user);
            setAdmin(user);
            return true;
        }
        return false;
    };
    const logout = () => {
        setAdminSession(null);
        setAdmin(null);
    };
    return {
        admin,
        isAuthenticated: !!admin,
        login,
        logout,
    };
}
