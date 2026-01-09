import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';

export default function UserDetail() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.get(`http://localhost:3000/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(data);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch user');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (riskLevel) => {
        if (riskLevel === 'HIGH RISK') return 'bg-red-100 text-red-700';
        if (riskLevel === 'MEDIUM RISK') return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    if (loading) return <div className="p-8 text-gray-600">Loading...</div>;
    if (!user) return <div className="p-8 text-gray-600">User not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">User Detail</h1>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(`/users/${id}/edit`)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                            Edit
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md border border-gray-300">
                            Back to List
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium text-gray-900">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Birth Place</p>
                            <p className="font-medium text-gray-900">{user.birth_place || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Birth Date</p>
                            <p className="font-medium text-gray-900">
                                {user.birth_date ? new Date(user.birth_date).toLocaleDateString() : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Gender</p>
                            <p className="font-medium text-gray-900">{user.gender || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Postal Code</p>
                            <p className="font-medium text-gray-900">{user.postal_code || '-'}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="font-medium text-gray-900">{user.address || '-'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center border border-gray-200">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Scoring Result</h2>
                    <div className="flex justify-center items-center gap-12">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Score</p>
                            <p className="text-4xl font-bold text-blue-600">{user.total_score}</p>
                        </div>
                        <div className="h-12 w-px bg-gray-300"></div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                            <span className={`inline-block px-6 py-2 text-sm font-bold rounded-full ${getRiskColor(user.risk_level)}`}>
                                {user.risk_level}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Selected Scoring Items</h2>
                    {user.user_answers && user.user_answers.length > 0 ? (
                        <div className="space-y-8">
                            {Object.entries(
                                user.user_answers.reduce((acc, answer) => {
                                    const groupName = answer.group_item?.information_group?.name || 'Other';
                                    if (!acc[groupName]) acc[groupName] = [];
                                    acc[groupName].push(answer);
                                    return acc;
                                }, {})
                            ).map(([groupName, answers]) => (
                                <div key={groupName}>
                                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">{groupName}</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                                        {answers.map((answer, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-start border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">{answer.group_item?.name}</p>
                                                    <p className="font-medium text-gray-900">{answer.item?.label}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-blue-600">{answer.item?.value}</span>
                                                    <p className="text-xs text-gray-600">Points</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-8">No answers recorded</p>
                    )}
                </div>
            </div>
        </div>
    );
}
