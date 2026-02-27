import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import './PatientPortal.css';
import swastikLogo from '../assets/swastiklogo.png';

const PatientPortal = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('portal_user');

    const isBasePortal = location.pathname === '/patient-portal' || location.pathname === '/patient-portal/';

    const features = [
        'Register Online',
        'Book Appointments',
        'View Medical Records',
        'Receive SMS Reminders',
        'Pay Bills Online'
    ];

    const handleLogout = () => {
        localStorage.removeItem('portal_user');
        navigate('/patient-portal');
    };

    const portalHeader = (
        <header className="patient-portal-app-header">
            <div className="header-left">
                <img src={swastikLogo} alt="Swastik Hospital" className="header-logo" />
                <div className="header-text">
                    <h1>Swastik Hospital</h1>
                    <p className="header-subtitle">Digital Healthcare Management System</p>
                </div>
            </div>
            <div className="header-right">
                {isLoggedIn ? (
                    <button type="button" className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <button type="button" className="logout-btn" onClick={() => navigate('/patient-portal/login')}>
                        Login
                    </button>
                )}
            </div>
        </header>
    );

    const portalFooter = (
        <footer className="patient-portal-app-footer">
            <div className="footer-content">
                <p className="copyright">
                    © {new Date().getFullYear()} Swastik Hospital. All rights reserved. | Developed and managed by ORELSE Private Limited.
                </p>
            </div>
        </footer>
    );

    if (!isBasePortal) {
        return (
            <div className="patient-portal-page patient-portal-with-header">
                {portalHeader}
                <div className="portal-back-bar portal-back-bar-full">
                    <button type="button" className="portal-back-btn" onClick={() => navigate('/patient-portal')}>
                        ← Back to Portal Home
                    </button>
                    <button type="button" className="portal-back-btn portal-back-home" onClick={() => navigate('/')}>
                        🏠 Back to Home
                    </button>
                </div>
                <div className="patient-portal-content">
                    <Outlet />
                </div>
                {portalFooter}
            </div>
        );
    }

    return (
        <div className="patient-portal-page patient-portal-with-header" style={{ flexDirection: 'column' }}>
            {portalHeader}
            <div className="patient-portal-content">
                <div className="portal-back-bar">
                    <button type="button" className="portal-back-btn" onClick={() => navigate('/')}>
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
            {portalFooter}
        </div>
    );
};

export default PatientPortal;
