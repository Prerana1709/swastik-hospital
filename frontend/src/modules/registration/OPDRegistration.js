// OPD registration – requires UHID (from patient registration). Saves to backend.
import React, { useState } from "react";
import { api } from "../../api/service";
import "./RegistrationForm.css";

function OPDRegistration() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    uhid: "",
    patientName: "",
    tokenNumber: "",
    department: "",
    doctor: "",
    visitDate: new Date().toISOString().slice(0, 10),
    chiefComplaint: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUhidBlur = async () => {
    if (!form.uhid.trim()) return;
    try {
      const patient = await api.getPatientByUhid(form.uhid.trim());
      if (patient && patient.name) setForm((prev) => ({ ...prev, patientName: patient.name }));
    } catch {
      // UHID not found – user can still type name
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createOPD({
        uhid: form.uhid.trim(),
        patient_name: form.patientName || undefined,
        department: form.department || undefined,
        doctor_id: form.doctor || undefined,
        visit_type: "OPD",
        notes: form.chiefComplaint || undefined,
      });
      alert("OPD registration saved successfully.");
      setForm({ uhid: "", patientName: "", tokenNumber: "", department: "", doctor: "", visitDate: new Date().toISOString().slice(0, 10), chiefComplaint: "" });
    } catch (err) {
      alert(err.message || "Failed to save OPD registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-page-wrapper">
      <div className="registration-form-page">
        <h2>OPD Registration</h2>
        <p className="registration-form-subtitle">Enter UHID from patient registration. Data is saved to the hospital system.</p>
        <form onSubmit={handleSubmit} className="registration-form-fields">
          <div className="form-row">
            <label>UHID *</label>
            <input name="uhid" value={form.uhid} onChange={handleChange} onBlur={handleUhidBlur} placeholder="e.g. SWASTIK-2026-00001" required />
          </div>
          <div className="form-row">
            <label>Patient Name</label>
            <input name="patientName" value={form.patientName} onChange={handleChange} placeholder="Fetched from UHID or enter manually" />
          </div>
          <div className="form-row">
            <label>Token Number *</label>
            <input name="tokenNumber" value={form.tokenNumber} onChange={handleChange} placeholder="Token no." required />
          </div>
          <div className="form-row">
            <label>Department *</label>
            <select name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Clinical Psychology">Clinical Psychology</option>
              <option value="Rehabilitation">Rehabilitation</option>
              <option value="Therapy / Counseling">Therapy / Counseling</option>
              <option value="Child & Adolescent Psychiatry">Child & Adolescent Psychiatry</option>
            </select>
          </div>
          <div className="form-row">
            <label>Consulting Doctor *</label>
            <select name="doctor" value={form.doctor} onChange={handleChange} required>
              <option value="">Select doctor</option>
              <option value="dr_pm_chougule">Dr. P. M. Chougule (M.D. Psychological Med., D.P.M. (Mumbai), M.B.F.L.P.S, M.A.P.A. (USA))</option>
              <option value="dr_nikhil_chougule">Dr. Nikhil Chougule (M.D. Psychiatry (Mumbai), M.D. Medicine (Russia))</option>
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
