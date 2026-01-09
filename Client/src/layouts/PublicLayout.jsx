import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export default function PublicLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    return <Outlet />;
}
