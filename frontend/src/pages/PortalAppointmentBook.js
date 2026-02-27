import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PortalStyles.css';
import drPm from "../assets/dr_pm.png";
import drNikhil from "../assets/dr_nikhil.png";

const PortalAppointmentBook = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1); // 1: Select Doctor, 2: Fill Details
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({
        type: 'CONSULTATION - 15 MIN',
        date: '',
        time: '',
        reason: ''
    });
    const [toast, setToast] = useState('');

    const location = useLocation();

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('portal_user'));
        if (!savedUser) {
            const currentPath = location.pathname + location.search;
            navigate(`/patient-portal/login?redirect=${encodeURIComponent(currentPath)}`);
        } else {
            setUser(savedUser);
            // Check for direct doctor booking from URL
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



    const doctors = [
        {
            id: 1,
            name: "Dr. P. M. Chougule",
            specialty: "M.D. Psychological Med., D.P.M. (Mumbai)",
            credentials: "M. B. F. L. P. S, M. A. P. A. (USA)",
            photo: drPm,
            location: "Swastik Hospital, Kolhapur"
        },
        {
            id: 2,
            name: "Dr. Nikhil Chougule",
            specialty: "M.D. Psychiatry (Mumbai)",
            credentials: "M. D. Medicine (Russia)",
            photo: drNikhil,
            location: "Swastik Hospital, Kolhapur"
        }
    ];

    const handleSelectDoctor = (doc) => {
        setSelectedDoctor(doc);
        setStep(2);
    };

    const handleBook = (e) => {
        e.preventDefault();
        setToast(`SMS Sent: Appointment confirmed with ${selectedDoctor.name} on ${formData.date} at ${formData.time}.`);

        setTimeout(() => {
            setToast('');
            navigate('/patient-portal/dashboard');
        }, 4000);
    };

    const renderCalendar = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="portal-calendar-box">
                <div className="calendar-header">
                    <span>February 2026</span>
                    <div style={{ fontSize: '0.8rem' }}>‹ Prev  Next ›</div>
                </div>
                <div className="calendar-grid">
                    {days.map(d => <div key={d} className="calendar-day-label">{d}</div>)}
                    {[...Array(31)].map((_, i) => (
                        <div key={i} className={`calendar-day ${i + 1 === 27 ? 'active' : ''}`}>
                            {i + 1}
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem', fontStyle: 'italic' }}>
                    * Teal indicates your selection or availability.
                </p>
            </div>
        );
    };

    if (!user) return null;

    return (
        <div className="portal-sub-page" style={{ maxWidth: step === 2 ? '1100px' : '800px' }}>
            <div className="portal-header">
                <h2>{step === 1 ? 'Select a Doctor' : `Booking with ${selectedDoctor.name}`}</h2>
                <p>{step === 1 ? 'Choose the specialist you wish to consult with.' : 'Select appointment type and preferred timing.'}</p>
            </div>

            {step === 1 ? (
                <div className="portal-doctors-selection">
                    {doctors.map(doc => (
                        <div key={doc.id} className="portal-doctor-card-alt">
                            <img src={doc.photo} alt={doc.name} className="portal-doctor-avatar-small" />
                            <div className="portal-doctor-info-alt">
                                <h3>{doc.name}</h3>
                                <p><strong>{doc.specialty}</strong></p>
                                <p>{doc.credentials}</p>
                                <span className="portal-doctor-location">📍 {doc.location}</span>
                            </div>
                            <button className="portal-btn-book" onClick={() => handleSelectDoctor(doc)}>Book</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="portal-booking-container">
                    <form className="portal-form" onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div className="portal-form-group">
                            <label>1. Select Appointment Type</label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="CONSULTATION - 15 MIN">CONSULTATION - 15 MIN</option>
                                <option value="THERAPY SESSION - 45 MIN">THERAPY SESSION - 45 MIN</option>
                                <option value="REHAB ASSESSMENT">REHAB ASSESSMENT</option>
                            </select>
                        </div>

                        <div className="portal-form-group">
                            <label>2. Preferred Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div className="portal-form-group">
                            <label>3. Select Time Slot</label>
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

                        <div className="portal-btn-row" style={{ display: 'flex', width: '100%', gap: '1rem' }}>
                            <button type="button" className="btn-portal btn-portal-register" onClick={() => setStep(1)} style={{ flex: 1 }}>
                                Change Doctor
                            </button>
                            <button type="submit" className="btn-portal btn-portal-login" style={{ flex: 1.5 }}>
                                Confirm Booking
                            </button>
                        </div>
                    </form>

                    <div className="portal-calendar-visualization">
                        <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Availability Calendar</h4>
                        {renderCalendar()}
                    </div>
                </div>
            )}

            {toast && (
                <div className="portal-toast">
                    <span>📱</span>
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default PortalAppointmentBook;
