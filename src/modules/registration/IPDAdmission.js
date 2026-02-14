// IPD admission form. Submit logs data to console; no API yet.
import React, { useState } from "react";
import "./RegistrationForm.css";

function IPDAdmission() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    ward: "",
    bedNumber: "",
    admissionDate: "",
    admittingDoctor: "",
    diagnosis: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log("IPD Admission submitted:", form);
    setTimeout(() => {
      setSubmitting(false);
      alert("IPD admission submitted successfully. (Check console for data)");
    }, 500);
  };

  return (
    <div className="registration-page-wrapper">
      <div className="registration-form-page">
      <h2>IPD Admission</h2>
      <p className="registration-form-subtitle">Inpatient admission and bed allocation</p>
      <form onSubmit={handleSubmit} className="registration-form-fields">
        <div className="form-row">
          <label>Patient Name *</label>
          <input name="patientName" value={form.patientName} onChange={handleChange} placeholder="Patient name" required />
        </div>
        <div className="form-row">
          <label>Ward *</label>
          <select name="ward" value={form.ward} onChange={handleChange} required>
            <option value="">Select ward</option>
            <option value="General Ward">General Ward</option>
            <option value="ICU">ICU</option>
            <option value="Private Room">Private Room</option>
          </select>
        </div>
        <div className="form-row">
          <label>Bed Number *</label>
          <input name="bedNumber" value={form.bedNumber} onChange={handleChange} placeholder="Bed no." required />
        </div>
        <div className="form-row">
          <label>Admission Date *</label>
          <input type="date" name="admissionDate" value={form.admissionDate} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Admitting Doctor *</label>
          <select name="admittingDoctor" value={form.admittingDoctor} onChange={handleChange} required>
            <option value="">Select doctor</option>
            <option value="Dr. Sharma">Dr. Sharma</option>
            <option value="Dr. Mehta">Dr. Mehta</option>
          </select>
        </div>
        <div className="form-row full-width">
          <label>Diagnosis *</label>
          <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="Primary diagnosis" rows="2" required />
        </div>
        <div className="form-row full-width">
          <label>Admission Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes" rows="3" />
        </div>
        <button type="submit" className="registration-submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      </div>
    </div>
  );
}

export default IPDAdmission;
