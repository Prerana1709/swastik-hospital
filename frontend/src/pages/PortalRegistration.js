import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PortalStyles.css';

const PortalRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patientName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        city: '',
        bloodGroup: ''
    });
    const [idGenerated, setIdGenerated] = useState('');

    const generateID = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        return `SWA-${year}-${random}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newId = generateID();
        const patientData = { ...formData, patientId: newId };

        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem('swastik_patients') || '[]');
        localStorage.setItem('swastik_patients', JSON.stringify([...existing, patientData]));

        setIdGenerated(newId);
    };

    if (idGenerated) {
        return (
            <div className="portal-sub-page">
                <div className="portal-success-alert">
                    <h2>Registration Successful!</h2>
                    <p>Please note down your Unique Patient ID for login:</p>
                    <span className="portal-id-display">{idGenerated}</span>
                </div>
                <div className="portal-btn-row">
                    <button className="btn-portal btn-portal-login" onClick={() => navigate('/patient-portal/login')}>
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="portal-sub-page">
            <div className="portal-header">
                <h2>Patient Registration</h2>
                <p>Fill in the details to create your secure patient account.</p>
            </div>

            <form className="portal-form" onSubmit={handleSubmit}>
                <div className="portal-form-group full-width">
                    <label>Full Patient Name *</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    />
                </div>

                <div className="portal-form-group">
                    <label>Email Address *</label>
                    <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="portal-form-group">
                    <label>Phone Number *</label>
                    <input
                        type="tel"
                        required
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div className="portal-form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                </div>

                <div className="portal-form-group">
                    <label>Gender</label>
                    <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="portal-form-group full-width">
                    <label>Address</label>
                    <textarea
                        placeholder="Residential address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>

                <div className="portal-btn-row">
                    <button type="button" className="btn-portal btn-portal-register" onClick={() => navigate('/patient-portal')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-portal btn-portal-login">
                        Register & Generate ID
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PortalRegistration;
