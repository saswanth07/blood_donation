import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Assuming the token has a 'role' or 'authorities' field
                const userRole = decoded.role || decoded.authorities?.[0] || 'USER';
                setUser(decoded);
                setRole(userRole);
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
            // Handle both { token: "..." } and raw string "..."
            const newToken = response.data.token || (typeof response.data === 'string' ? response.data : null);

            if (!newToken) {
                throw new Error("No token received");
            }

            localStorage.setItem('token', newToken);
            setToken(newToken);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setRole(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        role,
        token,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
