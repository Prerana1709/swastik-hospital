// Staff registration form. Submit logs data to console; no API yet.
import React, { useState } from "react";
import "./RegistrationForm.css";

function StaffRegistration() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    role: "",
    department: "",
    employeeId: "",
    phone: "",
    email: "",
    joinDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log("Staff Registration submitted:", form);
    setTimeout(() => {
      setSubmitting(false);
      alert("Staff registration submitted successfully. (Check console for data)");
    }, 500);
  };

  return (
    <div className="registration-page-wrapper">
      <div className="registration-form-page">
      <h2>Staff Registration</h2>
      <p className="registration-form-subtitle">Register nurses, reception and admin staff</p>
      <form onSubmit={handleSubmit} className="registration-form-fields">
        <div className="form-row">
          <label>Full Name *</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Staff name" required />
        </div>
        <div className="form-row">
          <label>Role *</label>
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select role</option>
            <option value="Nurse">Nurse</option>
            <option value="Reception">Reception</option>
            <option value="Admin">Admin</option>
            <option value="Lab Technician">Lab Technician</option>
          </select>
        </div>
        <div className="form-row">
          <label>Department *</label>
          <input name="department" value={form.department} onChange={handleChange} placeholder="Department" required />
        </div>
        <div className="form-row">
          <label>Employee ID *</label>
          <input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="Employee ID" required />
        </div>
        <div className="form-row">
          <label>Phone *</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone" required />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div className="form-row">
          <label>Join Date *</label>
          <input type="date" name="joinDate" value={form.joinDate} onChange={handleChange} required />
        </div>
        <button type="submit" className="registration-submit-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      </div>
    </div>
  );
}

export default StaffRegistration;
