import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const PrivateRoute = () => {
    const { user } = useContext(UserContext); // (1)

    return user ? <Outlet /> : <Navigate to="/login" />; // (2)
};

export default PrivateRoute;
