import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import UserDetail from './pages/UserDetail';
import UserForm from './pages/UserForm';
import BaseLayout from './layouts/BaseLayout';
import PublicLayout from './layouts/PublicLayout';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
                <Route element={<BaseLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/users/new" element={<UserForm />} />
                    <Route path="/users/:id" element={<UserDetail />} />
                    <Route path="/users/:id/edit" element={<UserForm />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
