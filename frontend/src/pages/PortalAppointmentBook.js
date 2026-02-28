import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PortalStyles.css';
import drPm from "../assets/dr_pm.png";
import drNikhil from "../assets/dr_nikhil.png";

const PortalAppointmentBook = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({
        type: 'CONSULTATION - 15 MIN',
        date: '',
        time: '',
        reason: ''
    });
    const [toast, setToast] = useState('');

    const doctors = [
        {
            id: 1,
            name: "Dr. P. M. Chougule",
            specialty: "M.D. Psychological Med., D.P.M. (Mumbai)",
            credentials: "Expert Psychiatrist & Mental Health Consultant",
            photo: drPm,
            experience: "15+ Years",
            location: "Swastik Hospital, Kolhapur"
        },
        {
            id: 2,
            name: "Dr. Nikhil Chougule",
            specialty: "M.D. Psychiatry (Mumbai)",
            credentials: "Specialist in Neuro-Psychiatry & Therapy",
            photo: drNikhil,
            experience: "8+ Years",
            location: "Swastik Hospital, Kolhapur"
        }
    ];

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('portal_user'));
        if (!savedUser) {
            const currentPath = location.pathname + location.search;
            navigate(`/patient-portal/login?redirect=${encodeURIComponent(currentPath)}`);
        } else {
            setUser(savedUser);
            const queryParams = new URLSearchParams(location.search);
            const docId = queryParams.get('docId');
            if (docId) {
                const doc = doctors.find(d => d.id === parseInt(docId));
                if (doc) {
                    setSelectedDoctor(doc);
                    setStep(2);
                }
            }
        }
    }, [navigate, location]);

    const handleSelectDoctor = (doc) => {
        setSelectedDoctor(doc);
        setStep(2);
    };

    const handleBook = (e) => {
        e.preventDefault();
        setToast(`Booking Confirmed! Appointment with ${selectedDoctor.name} on ${formData.date} at ${formData.time}.`);
        setTimeout(() => {
            setToast('');
            navigate('/patient-portal/dashboard');
        }, 3000);
    };

    const renderCalendar = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="portal-calendar-box">
                <div className="calendar-header">
                    <span>February 2026</span>
                    <div style={{ fontSize: '0.8rem', cursor: 'pointer', color: '#0d9488', fontWeight: 600 }}>
                        Next Month &rarr;
                    </div>
                </div>
                <div className="calendar-grid">
                    {days.map(d => <div key={d} className="calendar-day-label">{d}</div>)}
                    {[...Array(31)].map((_, i) => (
                        <div key={i} className={`calendar-day ${i + 1 === 27 ? 'active' : ''}`}>
                            {i + 1}
                        </div>
                    ))}
                </div>
                <div className="calendar-legend">
                    <div className="legend-item"><span className="legend-dot" style={{ background: '#0d9488' }}></span> Selected</div>
                    <div className="legend-item"><span className="legend-dot" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}></span> Available</div>
                </div>
            </div>
        );
    };

    if (!user) return null;

    return (
        <div className="portal-sub-page">
            <div className="portal-header">
                <h2>{step === 1 ? 'Select Your Specialist' : `Booking Appointment`}</h2>
                <p>{step === 1 ? 'Choose from our team of expert doctors for your consultation.' : `You are booking a session with ${selectedDoctor.name}.`}</p>
            </div>

            {step === 1 ? (
                <div className="portal-doctors-selection">
                    {doctors.map(doc => (
                        <div key={doc.id} className="portal-doctor-card-alt">
                            <img src={doc.photo} alt={doc.name} className="portal-doctor-avatar-small" />
                            <div className="portal-doctor-info-alt">
                                <h3>{doc.name}</h3>
                                <p style={{ color: '#0d9488', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{doc.specialty}</p>
                                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{doc.credentials}</p>
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                                    <span>🏅 {doc.experience}</span>
                                    <span>📍 Kolhapur</span>
                                </div>
                                <button
                                    className="portal-auth-btn"
                                    style={{ width: 'auto', padding: '0.6rem 1.5rem', marginTop: '1rem', fontSize: '0.85rem' }}
                                    onClick={() => handleSelectDoctor(doc)}
                                >
                                    Select & Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
                    <form className="portal-form-unified" onSubmit={handleBook}>
                        <div className="portal-form-group full-width">
                            <label>Appointment Type</label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="CONSULTATION - 15 MIN">Consultation - 15 Min</option>
                                <option value="THERAPY SESSION - 45 MIN">Therapy Session - 45 Min</option>
                                <option value="EMERGENCY CONSULTATION">Emergency Consultation</option>
                            </select>
                        </div>

                        <div className="portal-form-grid">
                            <div className="portal-form-group">
                                <label>Preferred Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div className="portal-form-group">
                                <label>Preferred Time Slot</label>
                                <select
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                >
                                    <option value="">Select Time</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:30 AM">11:30 AM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                    <option value="05:30 PM">05:30 PM</option>
                                </select>
                            </div>
                        </div>

                        <div className="portal-form-group full-width">
                            <label>Reason for Visit (Optional)</label>
                            <textarea
                                placeholder="Briefly describe your concerns..."
                                style={{ minHeight: '100px', padding: '1rem' }}
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn-portal" style={{ flex: 1, background: '#f1f5f9', color: '#475569', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer' }} onClick={() => setStep(1)}>
                                Back
                            </button>
                            <button type="submit" className="portal-auth-btn" style={{ flex: 2, marginTop: 0 }}>
                                Confirm Appointment
                            </button>
                        </div>
                    </form>

                    <div>
                        <h4 style={{ marginBottom: '1rem', color: '#0f172a' }}>Availability Status</h4>
                        {renderCalendar()}
                        <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                            <p style={{ fontSize: '0.85rem', color: '#0369a1', lineHeight: '1.5', margin: 0 }}>
                                <strong>Note:</strong> Final confirmation will be sent via SMS to your registered mobile number: <strong>{user.phone}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className="portal-toast" style={{ background: '#0d9488' }}>
                    <span>✅</span>
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default PortalAppointmentBook;
