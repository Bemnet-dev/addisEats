import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUserById } from './userService';

const STORAGE_KEY = 'addis_eats_current_user';
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const userData = JSON.parse(saved);
                const freshUser = getUserById(userData.id);
                return freshUser || null;
            }
            catch {
                return null;
            }
        }
        return null;
    });
    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
        else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user]);
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === STORAGE_KEY) {
                if (event.newValue === null) {
                    setUser(null);
                } else {
                    try {
                        const newUser = JSON.parse(event.newValue);
                        setUser(newUser);
                    } catch {
                        setUser(null);
                    }
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    const login = (userData) => {
        if (!userData || !userData.id) {
            return;
        }
        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    };
    const quickDemoLogin = () => {
        const demoUser = {
            id: 'demo-user-001',
            name: 'Demo User',
            email: 'demo@addiseats.com',
            phone: '+251 91 111 1111',
            area: 'Bole (Medhanialem, Atlas)',
            address: 'Demo Location',
            createdAt: new Date().toISOString(),
            verified: true,
        };
        setUser(demoUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('addis_eats_cart');
        localStorage.removeItem('addis_eats_special_instructions');
    };
    const updateProfile = (updates) => {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
    };
    return (<AuthContext.Provider value={{
        user,
        isAuthenticated: !!user,
        login,
        quickDemoLogin,
        logout,
        updateProfile,
    }}>
        {children}
    </AuthContext.Provider>);
};
AuthProvider.propTypes = {
    children: PropTypes.node,
};
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
