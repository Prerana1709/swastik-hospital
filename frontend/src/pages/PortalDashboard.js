import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PortalStyles.css';

const PortalDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('portal_user'));
        if (!savedUser) {
            navigate('/patient-portal/login');
        } else {
            setUser(savedUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('portal_user');
        navigate('/patient-portal');
    };

    if (!user) return null;

    return (
        <div className="portal-sub-page">
            <div className="portal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Welcome, {user.patientName}</h2>
                    <p>ID: {user.patientId}</p>
                </div>
                <button className="btn-portal btn-portal-register" onClick={handleLogout}>Logout</button>
            </div>

            <div className="portal-stats-grid">
                <div className="portal-stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/patient-portal/records')}>
                    <h3>2</h3>
                    <p>Past Visits</p>
                </div>
                <div className="portal-stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/patient-portal/records')}>
                    <h3>0</h3>
                    <p>Pending Bills</p>
                </div>
                <div className="portal-stat-card" style={{ cursor: 'pointer', background: '#e0f2f1' }} onClick={() => navigate('/patient-portal/appointments')}>
                    <h3>Book</h3>
                    <p>New Appointment</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="portal-section-title" style={{ margin: 0 }}>📄 My Medical Records</h3>
                <button
                    onClick={() => navigate('/patient-portal/records')}
                    style={{ border: 'none', background: 'none', color: '#008080', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                    View All History
                </button>
            </div>

            <table className="portal-data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Doctor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>24 Feb 2026</td>
                        <td>Initial Consultation</td>
                        <td>Dr. P. M. Chougule</td>
                        <td style={{ color: '#2e7d32', fontWeight: 600 }}>Completed</td>
                    </tr>
                    <tr>
                        <td>10 Feb 2026</td>
                        <td>Therapy Session</td>
                        <td>Rehab Center</td>
                        <td style={{ color: '#2e7d32', fontWeight: 600 }}>Completed</td>
                    </tr>
                </tbody>
            </table>

            <h3 className="portal-section-title">📅 Upcoming Appointments</h3>
            <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '15px', color: '#64748b' }}>
                No upcoming appointments found. <br />
                <button
                    style={{ marginTop: '1rem', border: 'none', background: 'none', color: '#008080', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate('/patient-portal/appointments')}
                >
                    Schedule one now
                </button>
            </div>
        </div>
    );
};

export default PortalDashboard;
