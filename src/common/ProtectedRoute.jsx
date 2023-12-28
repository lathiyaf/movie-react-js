import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    let location = useLocation();
    const accessToken = useSelector(state => state?.auth?.accessToken);
    /*== if user is not logged in==*/
    if (!accessToken && location.pathname !== "/signin") {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }
    /*== if user is logged in ==*/
    if (accessToken && location.pathname === "/signin") {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>
}

export default ProtectedRoute
