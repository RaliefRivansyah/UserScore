import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

export default function HomePage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.get('http://localhost:3000/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:3000/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const getRiskColor = (riskLevel) => {
        if (riskLevel === 'HIGH RISK') return 'bg-red-100 text-red-700';
        if (riskLevel === 'MEDIUM RISK') return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">ISM</h1>
                        <p className="text-gray-600 mt-1">Manage and monitor user scoring and risk assessment</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/users/new')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <span>+</span> New Application
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-600">Loading...</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                                            NO
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                                            NAME
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                                            SCORE
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                                            RISK STATUS
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-600">
                                                No users yet. Click "New Application" to add.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user, index) => (
                                            <tr key={user.id} className="hover:bg-gray-50 text-center">
                                                <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.total_score}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(
                                                            user.risk_level
                                                        )}`}>
                                                        {user.risk_level}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm font-medium">
                                                    <button
                                                        onClick={() => navigate(`/users/${user.id}`)}
                                                        className="text-blue-500 hover:text-blue-400 mx-1">
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="text-red-400 hover:text-red-300 mx-1">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
