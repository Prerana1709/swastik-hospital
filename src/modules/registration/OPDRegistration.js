// OPD registration form. Submit logs data to console; no API yet.
import React, { useState } from "react";
import "./RegistrationForm.css";

function OPDRegistration() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    tokenNumber: "",
    department: "",
    doctor: "",
    visitDate: "",
    chiefComplaint: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log("OPD Registration submitted:", form);
    setTimeout(() => {
      setSubmitting(false);
      alert("OPD registration submitted successfully. (Check console for data)");
    }, 500);
  };

  return (
    <div className="registration-page-wrapper">
      <div className="registration-form-page">
      <h2>OPD Registration</h2>
      <p className="registration-form-subtitle">Outpatient department registration</p>
      <form onSubmit={handleSubmit} className="registration-form-fields">
        <div className="form-row">
          <label>Patient Name *</label>
          <input name="patientName" value={form.patientName} onChange={handleChange} placeholder="Patient name" required />
        </div>
        <div className="form-row">
          <label>Token Number *</label>
          <input name="tokenNumber" value={form.tokenNumber} onChange={handleChange} placeholder="Token no." required />
        </div>
        <div className="form-row">
          <label>Department *</label>
          <select name="department" value={form.department} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="General OPD">General OPD</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
        </div>
        <div className="form-row">
          <label>Consulting Doctor *</label>
          <select name="doctor" value={form.doctor} onChange={handleChange} required>
            <option value="">Select doctor</option>
            <option value="Dr. Sharma">Dr. Sharma</option>
            <option value="Dr. Mehta">Dr. Mehta</option>
          </select>
        </div>
        <div className="form-row">
          <label>Visit Date *</label>
          <input type="date" name="visitDate" value={form.visitDate} onChange={handleChange} required />
        </div>
        <div className="form-row full-width">
          <label>Chief Complaint *</label>
          <textarea name="chiefComplaint" value={form.chiefComplaint} onChange={handleChange} placeholder="Brief complaint" rows="3" required />
        </div>
        <button type="submit" className="registration-submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      </div>
    </div>
  );
}

export default OPDRegistration;
