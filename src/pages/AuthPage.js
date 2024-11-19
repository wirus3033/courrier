import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('utilisateur');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login(username, role);
        navigate('/dashboard');
    };

    return (
        <div className="auth-container">
            <h2>Page d'authentification</h2>
            <img src="business-finance-logo-template-illustration-free-vector-removebg-preview.png" alt="Logo" className="logo" />
            <form className="auth-form">
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="administrateur">Administrateur</option>
                    <option value="secretaire">Secrétaire</option>
                    <option value="utilisateur">Utilisateur</option>
                </select>
                <button type="button" onClick={handleLogin}>Se connecter</button>
            </form>
        </div>
    );
}

export default AuthPage;
