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
            { id: 2, date: '2026-01-10', doctor: 'Dr. Nikhil Chougule', type: 'Follow-up Session', status: 'Completed' },
            { id: 3, date: '2026-02-27', doctor: 'Dr. P. M. Chougule', type: 'Clinical Assessment', status: 'Scheduled' },
        ],
        medical: [
            { id: 1, date: '2026-02-15', title: 'Clinical Summary - Week 1', doctor: 'Dr. P. M. Chougule', size: '1.2 MB', action: 'Download' },
            { id: 2, date: '2026-01-10', title: 'Prescription - Cognitive Therapy', doctor: 'Dr. Nikhil Chougule', size: '0.8 MB', action: 'View' },
            { id: 3, date: '2025-12-20', title: 'Lab Results - Blood Panel', doctor: 'General Diagnostics', size: '2.5 MB', action: 'Download' },
        ],
        billing: [
            { id: 1, date: '2026-02-15', details: 'Consultation Fee - ID: 4902', amount: '₹1,500', status: 'Paid' },
            { id: 2, date: '2026-01-10', details: 'Therapy Session - ID: 3821', amount: '₹850', status: 'Paid' },
            { id: 3, date: '2026-02-27', details: 'Follow-up Consultation', amount: '₹1,200', status: 'Pending' },
        ]
    };

    if (!user) return null;

    return (
        <div className="portal-sub-page">
            <div className="portal-header">
                <h2>Health History & Records</h2>
                <p>Access your complete medical journey, including appointments, clinical summaries, and billing.</p>
            </div>

            <div className="portal-auth-tabs" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', maxWidth: '500px' }}>
                <button
                    className={`portal-auth-tab ${activeTab === 'appointments' ? 'portal-auth-tab--active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                >
                    Appointments
                </button>
                <button
                    className={`portal-auth-tab ${activeTab === 'medical' ? 'portal-auth-tab--active' : ''}`}
                    onClick={() => setActiveTab('medical')}
                >
                    Documents
                </button>
                <button
                    className={`portal-auth-tab ${activeTab === 'billing' ? 'portal-auth-tab--active' : ''}`}
                    onClick={() => setActiveTab('billing')}
                >
                    Billing
                </button>
            </div>

            <div className="portal-table-container" style={{ marginTop: '2rem' }}>
                <table className="portal-data-table">
                    <thead>
                        {activeTab === 'appointments' && (
                            <tr>
                                <th>Appointment Date</th>
                                <th>Doctor / Specialist</th>
                                <th>Consultation Type</th>
                                <th>Status</th>
                            </tr>
                        )}
                        {activeTab === 'medical' && (
                            <tr>
                                <th>Date Generated</th>
                                <th>Document Name</th>
                                <th>Prescribed By</th>
                                <th>File Details</th>
                                <th>Action</th>
                            </tr>
                        )}
                        {activeTab === 'billing' && (
                            <tr>
                                <th>Invoice Date</th>
                                <th>Description</th>
                                <th>Total Amount</th>
                                <th>Payment Status</th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {activeTab === 'appointments' && records.appointments.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td style={{ fontWeight: 600 }}>{item.doctor}</td>
                                <td>{item.type}</td>
                                <td>
                                    <span className={`status-badge ${item.status === 'Completed' ? 'status-badge--completed' : 'status-badge--pending'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {activeTab === 'medical' && records.medical.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td style={{ fontWeight: 600 }}>📄 {item.title}</td>
                                <td>{item.doctor}</td>
                                <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>PDF ({item.size})</td>
                                <td>
                                    <button
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            border: '1.5px solid #e2e8f0',
                                            background: 'white',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: '#0d9488'
                                        }}
                                    >
                                        {item.action}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {activeTab === 'billing' && records.billing.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.details}</td>
                                <td style={{ fontWeight: 700 }}>{item.amount}</td>
                                <td>
                                    <span className={`status-badge ${item.status === 'Paid' ? 'status-badge--paid' : 'status-badge--pending'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: '#fdf2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#991b1b', lineHeight: '1.4' }}>
                    <strong>Confidentiality Notice:</strong> All medical records are encrypted and strictly confidential. If you notice any discrepancy, please contact our administrative desk immediately.
                </p>
            </div>
        </div>
    );
};

export default PortalMedicalRecords;
