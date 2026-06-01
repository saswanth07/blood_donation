import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, role, token, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to their own dashboard if logged in but unauthorized for this route
        if (role === 'DONOR') return <Navigate to="/donor" replace />;
        if (role === 'HOSPITAL') return <Navigate to="/hospital" replace />;
        if (role === 'ADMIN') return <Navigate to="/admin" replace />;
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
