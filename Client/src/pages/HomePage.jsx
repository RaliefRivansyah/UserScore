import React from 'react';
import { useNavigate } from 'react-router';

export default function HomePage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">ISM</h1>
                        <p className="text-gray-500 mt-1">Manage User Score</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <span>+</span> New User
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2">
                            <span>↪</span> Logout
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">NO</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">NAME</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">GENDER</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">SCORE</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">RISK STATUS</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50 text-center">
                                    <td className="px-6 py-4 text-sm text-gray-500">6</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">asd</div>
                                        <div className="text-sm text-gray-500">asdasd</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">LAKI LAKI</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">57.59</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            MEDIUM RISK
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-medium ">
                                        <button className="text-blue-600 hover:text-blue-900 mx-1">View</button>
                                        <button className="text-green-600 hover:text-green-900 mx-1">Edit</button>
                                        <button className="text-red-600 hover:text-red-900 mx-1">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
