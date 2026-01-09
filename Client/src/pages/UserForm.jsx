import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';

export default function UserForm() {
    const [formData, setFormData] = useState({
        name: '',
        birth_place: '',
        birth_date: '',
        gender: '',
        postal_code: '',
        address: '',
    });
    const [scoringMasters, setScoringMasters] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const fetchScoringMasters = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.get('http://localhost:3000/scoring-masters', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setScoringMasters(data);
        } catch (error) {
            console.error('Error fetching scoring masters:', error);
        }
    };

    const fetchUser = async () => {
        if (!isEdit) return;
        try {
            const token = localStorage.getItem('access_token');
            const { data } = await axios.get(`http://localhost:3000/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFormData({
                name: data.name || '',
                birth_place: data.birth_place || '',
                birth_date: data.birth_date || '',
                gender: data.gender || '',
                postal_code: data.postal_code || '',
                address: data.address || '',
            });

            const answers = {};
            data.user_answers?.forEach((answer) => {
                answers[answer.group_item_id] = answer.item_id;
            });
            setSelectedAnswers(answers);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchScoringMasters();
            await fetchUser();
            setLoading(false);
        };
        init();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAnswerChange = (groupItemId, itemId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [groupItemId]: itemId,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const answers = Object.entries(selectedAnswers).map(([group_item_id, item_id]) => ({
            group_item_id: parseInt(group_item_id),
            item_id: parseInt(item_id),
        }));

        const payload = {
            ...formData,
            answers,
        };

        try {
            const token = localStorage.getItem('access_token');
            if (isEdit) {
                await axios.put(`http://localhost:3000/users/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('User updated successfully');
            } else {
                await axios.post('http://localhost:3000/users', payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('User created successfully');
            }
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Failed to save user');
        }
    };

    if (loading) return <div className="p-8 text-gray-600">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{isEdit ? 'Edit User' : 'New User Application'}</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md border border-gray-300">
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-gray-600">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Birth Place</label>
                                <input
                                    type="text"
                                    name="birth_place"
                                    value={formData.birth_place}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Birth Date</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500 css-date-input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500">
                                    <option value="">Select Gender</option>
                                    <option value="LAKI LAKI">LAKI LAKI</option>
                                    <option value="PEREMPUAN">PEREMPUAN</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Postal Code</label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-gray-600">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Scoring Items</h2>
                        {scoringMasters.map((group) => (
                            <div key={group.id} className="mb-6">
                                <h3 className="font-bold text-lg mb-3 text-gray-700">{group.name}</h3>
                                {group.group_items?.map((groupItem) => (
                                    <div key={groupItem.id} className="mb-4 pl-4 border-l-2 border-gray-300">
                                        <p className="font-medium mb-2 text-gray-600">{groupItem.name}</p>
                                        <div className="space-y-2">
                                            {groupItem.items?.map((item) => (
                                                <label
                                                    key={item.id}
                                                    className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
                                                    <input
                                                        type="radio"
                                                        name={`group_item_${groupItem.id}`}
                                                        value={item.id}
                                                        checked={selectedAnswers[groupItem.id] === item.id}
                                                        onChange={() => handleAnswerChange(groupItem.id, item.id)}
                                                        className="w-4 h-4 accent-blue-500"
                                                    />
                                                    <span className="text-sm">
                                                        {item.label} (Value: {item.value})
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            {isEdit ? 'Update' : 'Create'} User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
