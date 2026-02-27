import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import './PatientPortal.css';

const PatientPortal = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isBasePortal = location.pathname === '/patient-portal' || location.pathname === '/patient-portal/';

    const features = [
        'Register Online',
        'Book Appointments',
        'View Medical Records',
        'Receive SMS Reminders',
        'Pay Bills Online'
    ];

    if (!isBasePortal) {
        return (
            <div className="patient-portal-page" style={{ alignItems: 'flex-start', paddingTop: '5vh' }}>
                <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <button
                            onClick={() => navigate('/patient-portal')}
                            style={{ background: 'none', border: 'none', color: '#008080', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            ← Back to Portal Home
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            style={{ background: 'none', border: 'none', color: '#607d8b', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            🏠 Back to Home
                        </button>
                    </div>
                    <Outlet />
                </div>
            </div>
        );
    }

    return (
        <div className="patient-portal-page" style={{ flexDirection: 'column' }}>
            <div style={{ width: '100%', maxWidth: '1000px', marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', color: '#008080', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.95rem' }}
                >
                    ← Back to Swastik Hospital Home
                </button>
            </div>
            <div className="patient-portal-container">
                {/* Left Side: Info Panel */}
                <div className="portal-left-panel">
                    <div className="portal-illustration" aria-hidden="true">
                        👤
                    </div>
                    <div className="portal-badge">Patient</div>

                    <ul className="portal-features">
                        {features.map((feature, index) => (
                            <li key={index}>
                                <span className="feature-icon">✔</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side: Content Panel */}
                <div className="portal-right-panel">
                    <span className="portal-welcome-tags">SECURE ACCESS</span>
                    <h1>Welcome to Swastik Patient Portal</h1>
                    <p className="portal-description">
                        Your health, managed securely and confidentially. Access your clinical records,
                        schedule therapy sessions, and connect with your care team anytime, anywhere.
                    </p>

                    <div className="portal-actions">
                        <button
                            className="btn-portal btn-portal-login"
                            onClick={() => navigate('/patient-portal/login')}
                        >
                            Login
                        </button>
                        <button
                            className="btn-portal btn-portal-register"
                            onClick={() => navigate('/patient-portal/register')}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientPortal;
