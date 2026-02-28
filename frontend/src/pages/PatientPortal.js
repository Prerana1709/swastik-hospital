import React from 'react';
import { useNavigate, Outlet, useLocation, Navigate } from 'react-router-dom';
import PortalAuth from './PortalAuth';
import { SimpleFooter } from '../components/homepage';
import './PatientPortal.css';
import swastikLogo from '../assets/swastiklogo.png';

const PatientPortal = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('portal_user');

    // If it's the base path /patient-portal, or /patient-portal/login/register, show Auth
    const isAuthPath = location.pathname === '/patient-portal' ||
        location.pathname === '/patient-portal/' ||
        location.pathname.includes('/login') ||
        location.pathname.includes('/register');

    const handleLogout = () => {
        localStorage.removeItem('portal_user');
        navigate('/patient-portal');
    };

    // If not logged in and trying to access dashboard/appointments, etc., redirect to login
    if (!isLoggedIn && !isAuthPath) {
        return <Navigate to="/patient-portal" replace />;
    }

    // If not logged in and on auth path, show the new modern PortalAuth
    if (!isLoggedIn && isAuthPath) {
        return <PortalAuth />;
    }

    // Header for logged-in users (Modern Sidebar style can be added later)
    const portalHeader = (
        <header className="patient-portal-app-header">
            <div className="header-left">
                <img src={swastikLogo} alt="Swastik Hospital" className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
                <div className="header-text">
                    <h1>Swastik Patient Portal</h1>
                    <p className="header-subtitle">Managing your health journey digitally</p>
                </div>
            </div>
            <div className="header-right">
                <button type="button" className="logout-btn" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </header>
    );


    return (
        <div className="patient-portal-page">
            {portalHeader}
            <div className="patient-portal-layout">
                {/* Minimal sidebar for dashboard navigation */}
                <aside className="portal-sidebar">
                    <nav>
                        <button onClick={() => navigate('/patient-portal/dashboard')} className={location.pathname.includes('dashboard') ? 'active' : ''}>Dashboard</button>
                        <button onClick={() => navigate('/patient-portal/appointments')} className={location.pathname.includes('appointments') ? 'active' : ''}>Appointments</button>
                        <button onClick={() => navigate('/patient-portal/records')} className={location.pathname.includes('records') ? 'active' : ''}>Records</button>
                    </nav>
                </aside>

                <main className="patient-portal-content">
                    <Outlet />
                </main>
            </div>
            <SimpleFooter />
        </div>
    );
};

export default PatientPortal;
