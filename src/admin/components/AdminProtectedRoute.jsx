import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../../utils/api';

const AdminProtectedRoute = ({ children }) => {
    const [status, setStatus] = useState({ loading: true, authorized: false });

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setStatus({ loading: false, authorized: false });
                return;
            }

            try {
                const res = await api.get('/auth/user');
                if (res.data.role === 'admin' || res.data.role === 'owner') {
                    setStatus({ loading: false, authorized: true });
                } else {
                    setStatus({ loading: false, authorized: false });
                }
            } catch (err) {
                setStatus({ loading: false, authorized: false });
            }
        };

        verifyAdmin();
    }, []);

    if (status.loading) {
        return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono text-sm tracking-widest">AUTHENTICATING OPERATOR...</div>;
    }

    if (!status.authorized) {
        return <Navigate to="/admin/login" />;
    }

    return children ? children : <Outlet />;
};

export default AdminProtectedRoute;
