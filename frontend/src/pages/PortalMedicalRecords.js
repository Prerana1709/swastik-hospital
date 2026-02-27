import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PortalStyles.css';

const PortalMedicalRecords = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('appointments');

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('portal_user'));
        if (!savedUser) navigate('/patient-portal/login');
        else setUser(savedUser);
    }, [navigate]);

    const records = {
        appointments: [
            { id: 1, date: '2026-02-15', doctor: 'Dr. P. M. Chougule', type: 'Initial Consultation', status: 'Completed' },
            { id: 2, date: '2026-01-10', doctor: 'Dr. Nikhil Chougule', type: 'Follow-up', status: 'Completed' },
        ],
        medical: [
            { id: 1, date: '2026-02-15', title: 'Clinical Summary - Week 1', doctor: 'Dr. P. M. Chougule', action: 'Download' },
            { id: 2, date: '2026-01-10', title: 'Prescription - Therapy', doctor: 'Dr. Nikhil Chougule', action: 'View' },
        ],
        billing: [
            { id: 1, date: '2026-02-15', details: 'Consultation Fee', amount: '₹1,500', status: 'Paid' },
            { id: 2, date: '2026-01-10', details: 'Medicine Pharmacy', amount: '₹850', status: 'Paid' },
            { id: 3, date: '2026-02-27', details: 'Pending Session Fee', amount: '₹1,200', status: 'Pending' },
        ]
    };

    if (!user) return null;

    return (
        <div className="portal-sub-page">
            <div className="portal-header">
                <h2>Health History & Records</h2>
                <p>Track your appointments, medical summaries, and billing information in one place.</p>
            </div>

            <div className="portal-records-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setActiveTab('appointments')}
                    style={{
                        background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer',
                        fontWeight: activeTab === 'appointments' ? 700 : 500,
                        color: activeTab === 'appointments' ? '#008080' : '#64748b',
                        borderBottom: activeTab === 'appointments' ? '3px solid #008080' : 'none'
                    }}
                >
                    Appointments
                </button>
                <button
                    onClick={() => setActiveTab('medical')}
                    style={{
                        background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer',
                        fontWeight: activeTab === 'medical' ? 700 : 500,
                        color: activeTab === 'medical' ? '#008080' : '#64748b',
                        borderBottom: activeTab === 'medical' ? '3px solid #008080' : 'none'
                    }}
                >
                    Medical Records
                </button>
                <button
                    onClick={() => setActiveTab('billing')}
                    style={{
                        background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer',
                        fontWeight: activeTab === 'billing' ? 700 : 500,
                        color: activeTab === 'billing' ? '#008080' : '#64748b',
                        borderBottom: activeTab === 'billing' ? '3px solid #008080' : 'none'
                    }}
                >
                    Billing History
                </button>
            </div>

            <div className="portal-table-container">
                <table className="portal-table">
                    <thead>
                        {activeTab === 'appointments' && (
                            <tr>
                                <th>Date</th>
                                <th>Doctor</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        )}
                        {activeTab === 'medical' && (
                            <tr>
                                <th>Date</th>
                                <th>Document Title</th>
                                <th>Doctor</th>
                                <th>Action</th>
                            </tr>
                        )}
                        {activeTab === 'billing' && (
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {activeTab === 'appointments' && records.appointments.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.doctor}</td>
                                <td>{item.type}</td>
                                <td><span className="status-badge" style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{item.status}</span></td>
                            </tr>
                        ))}
                        {activeTab === 'medical' && records.medical.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.title}</td>
                                <td>{item.doctor}</td>
                                <td><button className="link-btn" style={{ color: '#008080', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>{item.action}</button></td>
                            </tr>
                        ))}
                        {activeTab === 'billing' && records.billing.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.details}</td>
                                <td>{item.amount}</td>
                                <td>
                                    <span className="status-badge" style={{
                                        background: item.status === 'Paid' ? '#e8f5e9' : '#fff3e0',
                                        color: item.status === 'Paid' ? '#2e7d32' : '#e65100',
                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem'
                                    }}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <button
                    onClick={() => navigate('/patient-portal/dashboard')}
                    className="btn-portal btn-portal-register"
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default PortalMedicalRecords;
