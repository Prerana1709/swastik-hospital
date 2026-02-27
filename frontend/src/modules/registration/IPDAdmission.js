// IPD admission – requires UHID. Saves to backend; data reflects in IPD ward / clinical.
import React, { useState } from "react";
import { api } from "../../api/service";
import "./RegistrationForm.css";

function IPDAdmission() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    uhid: "",
    patientName: "",
    ward: "",
    bedNumber: "",
    admissionDate: new Date().toISOString().slice(0, 10),
    admittingDoctor: "",
    diagnosis: "",
    notes: "",
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
      // UHID not found
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createIPD({
        uhid: form.uhid.trim(),
        patient_name: form.patientName || undefined,
        ward: form.ward || undefined,
        bed_number: form.bedNumber || undefined,
        admission_reason: form.diagnosis || undefined,
        admitted_by: form.admittingDoctor || undefined,
        notes: form.notes || undefined,
      });
      alert("IPD admission saved successfully. Patient will appear in IPD ward.");
      setForm({ uhid: "", patientName: "", ward: "", bedNumber: "", admissionDate: new Date().toISOString().slice(0, 10), admittingDoctor: "", diagnosis: "", notes: "" });
    } catch (err) {
      alert(err.message || "Failed to save IPD admission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-page-wrapper">
      <div className="registration-form-page">
        <h2>IPD Admission</h2>
        <p className="registration-form-subtitle">Enter UHID from patient registration. Data is saved and shown in IPD ward.</p>
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
            <label>Ward *</label>
            <select name="ward" value={form.ward} onChange={handleChange} required>
              <option value="">Select ward</option>
              <option value="Female Ward (Psychiatry)">Female Ward (Psychiatry)</option>
              <option value="Male Ward (Psychiatry)">Male Ward (Psychiatry)</option>
              <option value="Rehabilitation Ward">Rehabilitation Ward</option>
              <option value="De-addiction Ward">De-addiction Ward</option>
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
              <option value="dr_pm_chougule">Dr. P. M. Chougule (M.D. Psychological Med., D.P.M. (Mumbai), M.B.F.L.P.S, M.A.P.A. (USA))</option>
              <option value="dr_nikhil_chougule">Dr. Nikhil Chougule (M.D. Psychiatry (Mumbai), M.D. Medicine (Russia))</option>
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
