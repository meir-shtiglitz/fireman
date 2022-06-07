import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

function AdminRoute({ Component }) {
    const { user, isAdmin } = useSelector(state => state.User);        
    console.log('user From admin route', user)

    if (user === {}) return <></>;//{} = the initial state user before getting the result from server
    return (
        <>
            {user
            ? Component
            : <Navigate to='/build/page' />}
        </>
    )
}

export default AdminRoute