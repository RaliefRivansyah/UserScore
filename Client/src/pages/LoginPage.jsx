import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:3000/login', {
                username,
                password,
            });
            localStorage.setItem('access_token', data.access_token);
            alert('Login successful');
            navigate('/');
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="p-6 bg-white rounded shadow-md w-80 border border-gray-200">
                <h1 className="text-2xl text-center font-bold mb-4 text-gray-800">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-600">Username</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
