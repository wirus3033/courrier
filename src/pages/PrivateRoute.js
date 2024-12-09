import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, allowedRoles }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default PrivateRoute;
