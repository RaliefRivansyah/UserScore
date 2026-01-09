import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/register', {
                username,
                password,
            });
            alert('Register successful');
            navigate('/login');
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || 'Register failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded shadow-md w-80">
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
                </form>
                <p className="mt-4 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
