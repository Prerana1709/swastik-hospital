// Doctor registration – saves to backend.
import React, { useState } from "react";
import { api } from "../../api/service";
import "./RegistrationForm.css";

function DoctorRegistration() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    qualification: "",
    specialization: "",
    department: "",
    registrationNumber: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createDoctor({
        name: form.fullName,
        qualification: form.qualification,
        specialization: form.specialization,
        department: form.department,
        phone: form.phone,
        email: form.email,
      });
      alert("Doctor registered successfully.");
      setForm({ fullName: "", qualification: "", specialization: "", department: "", registrationNumber: "", phone: "", email: "" });
    } catch (err) {
      alert(err.message || "Failed to save doctor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-page-wrapper">
      <div className="registration-form-page">
        <h2>Doctor Registration</h2>
        <p className="registration-form-subtitle">Add doctors and assign departments</p>
        <form onSubmit={handleSubmit} className="registration-form-fields">
          <div className="form-row">
            <label>Full Name *</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Doctor name" required />
          </div>
          <div className="form-row">
            <label>Qualification *</label>
            <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. MBBS, MD" required />
          </div>
          <div className="form-row">
            <label>Specialization *</label>
            <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Cardiology" required />
          </div>
          <div className="form-row">
            <label>Department *</label>
            <select name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select department</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Clinical Psychology">Clinical Psychology</option>
              <option value="Rehabilitation">Rehabilitation</option>
              <option value="Therapy / Counseling">Therapy / Counseling</option>
              <option value="Child & Adolescent Psychiatry">Child & Adolescent Psychiatry</option>
            </select>
          </div>
          <div className="form-row">
            <label>Medical Registration Number *</label>
            <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} placeholder="Registration no." required />
          </div>
          <div className="form-row">
            <label>Phone *</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone" required />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
          </div>
          <button type="submit" className="registration-submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DoctorRegistration;
