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

    if (!user) return null;

    return (
        <div className="portal-sub-page">
            <div className="portal-header">
                <h2>Welcome back, {user.patientName}</h2>
                <p>Track your health journey and manage appointments securely.</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#0d9488', fontWeight: 600 }}>
                    Patient ID: {user.patientId}
                </div>
            </div>

            <div className="portal-stats-grid">
                <div className="portal-stat-card" onClick={() => navigate('/patient-portal/records')}>
                    <span className="icon">🏥</span>
                    <h3>2</h3>
                    <p>Past Visits</p>
                </div>
                <div className="portal-stat-card" onClick={() => navigate('/patient-portal/records')}>
                    <span className="icon">💳</span>
                    <h3>0</h3>
                    <p>Pending Bills</p>
                </div>
                <div className="portal-stat-card" style={{ background: '#f0fdfa', borderColor: '#99f6e4' }} onClick={() => navigate('/patient-portal/appointments')}>
                    <span className="icon">📅</span>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}>Book Now</h3>
                    <p>New Appointment</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="portal-section-title" style={{ margin: 0 }}>
                    📄 Recent Medical Records
                </h3>
                <button
                    onClick={() => navigate('/patient-portal/records')}
                    style={{
                        border: 'none',
                        background: 'none',
                        color: '#0d9488',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}
                >
                    View All History &rarr;
                </button>
            </div>

            <div className="portal-table-container">
                <table className="portal-data-table">
                    <thead>
                        <tr>
                            <th>Visit Date</th>
                            <th>Consultation Type</th>
                            <th>Doctor / Specialist</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>24 Feb 2026</td>
                            <td>Initial Consultation</td>
                            <td>Dr. P. M. Chougule</td>
                            <td><span className="status-badge status-badge--completed">Completed</span></td>
                        </tr>
                        <tr>
                            <td>10 Feb 2026</td>
                            <td>Therapy Session</td>
                            <td>Rehab Center</td>
                            <td><span className="status-badge status-badge--completed">Completed</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h3 className="portal-section-title">📅 Upcoming Appointments</h3>
                <div style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: '20px',
                    border: '2px dashed #e2e8f0',
                    color: '#64748b'
                }}>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🗓️</span>
                    <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>No upcoming appointments scheduled.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Please book an appointment to consult with our experts.</p>
                    <button
                        className="portal-auth-btn"
                        style={{ width: 'auto', padding: '0.75rem 2rem', marginTop: '1.5rem' }}
                        onClick={() => navigate('/patient-portal/appointments')}
                    >
                        Schedule Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortalDashboard;
