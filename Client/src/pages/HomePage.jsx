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
        if (riskLevel === 'HIGH RISK') return 'bg-red-400/10 text-red-400';
        if (riskLevel === 'MEDIUM RISK') return 'bg-yellow-400/10 text-yellow-400';
        return 'bg-green-400/10 text-green-400';
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-200">ISM</h1>
                        <p className="text-slate-400 mt-1">Manage and monitor user scoring and risk assessment</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/users/new')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <span>+</span> New Application
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-md border border-slate-700 flex items-center gap-2">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-slate-700">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400">Loading...</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-900 border-b border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                                            NO
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                                            NAME
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                                            SCORE
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                                            RISK STATUS
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                                            ACTIONS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                                No users yet. Click "New Application" to add.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user, index) => (
                                            <tr key={user.id} className="hover:bg-slate-700/50 text-center">
                                                <td className="px-6 py-4 text-sm text-slate-400">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-200">{user.name}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-200">{user.total_score}</td>
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
