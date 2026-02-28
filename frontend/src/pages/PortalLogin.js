import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PortalStyles.css';

const PortalLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const redirectPath = queryParams.get('redirect') || '/patient-portal/dashboard';

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        const patients = JSON.parse(localStorage.getItem('swastik_patients') || '[]');

        const user = patients.find(p => p.patientId === loginId || p.email === loginId);

        if (!user) {
            setError('Invalid Patient ID or Email. Please try again or Register.');
            return;
        }
        if (user.password != null && user.password !== '' && user.password !== password) {
            setError('Invalid password. Please try again.');
            return;
        }
        localStorage.setItem('portal_user', JSON.stringify(user));
        navigate(redirectPath);
    };


    return (
        <div className="portal-sub-page">
            <div className="portal-header" style={{ textAlign: 'center' }}>
                <h2>Login to Patient Portal</h2>
                <p>Enter your unique Patient ID or Registered Email to continue.</p>
            </div>

            <form className="portal-form" onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
                <div className="portal-form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Patient ID / Email</label>
                    <input
                        type="text"
                        required
                        placeholder="SWA-2026-XXXX or email@example.com"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                    />
                </div>

                <div className="portal-form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Password</label>
                    <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                {error && <p style={{ color: '#d32f2f', margin: '0 0 1rem', fontSize: '0.9rem' }}>{error}</p>}

                <button type="submit" className="btn-portal btn-portal-login" style={{ width: '100%', marginBottom: '1rem' }}>
                    Secure Login
                </button>

                <button type="button" className="btn-portal btn-portal-register" onClick={() => navigate('/patient-portal/register')} style={{ width: '100%' }}>
                    New Patient? Register Here
                </button>
            </form>
        </div>
    );
};

export default PortalLogin;
