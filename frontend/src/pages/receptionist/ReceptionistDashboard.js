import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTodayAppointments,
  getPendingRequests,
  setPendingRequests,
  getDoctors,
  getEmergencyQueue,
  setEmergencyQueue,
  getAdmissionRequests,
  getPatientsTodayCounts,
} from "./receptionistData";
import "./ReceptionistDashboard.css";

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [pending, setPending] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [emergencyQueue, setEmergencyQueueState] = useState([]);
  const [admissionRequests, setAdmissionRequests] = useState([]);
  const [patientCounts, setPatientCounts] = useState({ total: 0, opd: 0, followUp: 0, therapy: 0, emergency: 0 });

  const refresh = () => {
    const today = new Date().toISOString().slice(0, 10);
    setAppointments(getTodayAppointments());
    setPending(getPendingRequests());
    setDoctors(getDoctors());
    setEmergencyQueueState(getEmergencyQueue());
    setAdmissionRequests(getAdmissionRequests());
    setPatientCounts(getPatientsTodayCounts());
  };

  useEffect(refresh, []);

  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const doctorAbsent = doctors.find((d) => !d.available);

  const handleConfirmRequest = (req) => {
    setPending((prev) => prev.filter((r) => r.id !== req.id));
    setPendingRequests(pending.filter((r) => r.id !== req.id));
    refresh();
  };

  const handleRescheduleRequest = (req) => {
    navigate("/receptionist/appointments", { state: { reschedule: req } });
  };

  const handleCancelRequest = (req) => {
    setPending((prev) => prev.filter((r) => r.id !== req.id));
    setPendingRequests(pending.filter((r) => r.id !== req.id));
    refresh();
  };

  const handleAddEmergency = () => {
    navigate("/receptionist/patients/register", { state: { emergency: true } });
  };

  return (
    <div className="recep-dash">
      <h1 className="recep-dash-title">Receptionist Dashboard</h1>
      <p className="recep-dash-subtitle">Today&apos;s overview. Workflow-focused.</p>

      {/* Quick Register – prominent */}
      <section className="recep-dash-section recep-dash-quick-reg">
        <button type="button" className="recep-quick-reg-btn" onClick={() => navigate("/receptionist/patients/register")}>
          ➕ Register New Patient
        </button>
      </section>

      {/* 1. Today's Appointments */}
      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">Today&apos;s Appointments</h2>
        <div className="recep-dash-cards">
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{appointments.length}</span>
            <span className="recep-dash-card-label">Total</span>
          </div>
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{confirmed}</span>
            <span className="recep-dash-card-label">Confirmed</span>
          </div>
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{pendingCount}</span>
            <span className="recep-dash-card-label">Pending</span>
          </div>
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{completed}</span>
            <span className="recep-dash-card-label">Completed</span>
          </div>
        </div>
        {doctorAbsent && (
          <div className="recep-dash-warning">
            <strong>Doctor Not Available:</strong> {doctorAbsent.name}
            <div className="recep-dash-warning-actions">
              <button type="button" className="recep-btn recep-btn-secondary">Reschedule</button>
              <span className="recep-dash-alt-slots">Alternative slots: 2:00 PM, 4:00 PM</span>
            </div>
          </div>
        )}
      </section>

      {/* 2. Pending Appointment Requests */}
      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">Pending Appointment Requests</h2>
        <div className="recep-table-wrap">
          <table className="recep-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={5} className="recep-table-empty">No pending requests</td></tr>
              ) : (
                pending.map((req) => (
                  <tr key={req.id}>
                    <td>{req.patientName}</td>
                    <td>{req.doctor}</td>
                    <td>{req.date} {req.time}</td>
                    <td>{req.type || "OPD"}</td>
                    <td>
                      <button type="button" className="recep-btn recep-btn-small recep-btn-primary" onClick={() => handleConfirmRequest(req)}>Confirm</button>
                      <button type="button" className="recep-btn recep-btn-small recep-btn-secondary" onClick={() => handleRescheduleRequest(req)}>Reschedule</button>
                      <button type="button" className="recep-btn recep-btn-small recep-btn-danger" onClick={() => handleCancelRequest(req)}>Cancel</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Total Patients Today */}
      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">Total Patients Today</h2>
        <div className="recep-dash-cards">
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{patientCounts.total}</span>
            <span className="recep-dash-card-label">Total</span>
          </div>
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{patientCounts.opd}</span>
            <span className="recep-dash-card-label">OPD walk-ins</span>
          </div>
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{patientCounts.followUp}</span>
            <span className="recep-dash-card-label">Follow-ups</span>
          </div>
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{patientCounts.therapy}</span>
            <span className="recep-dash-card-label">Therapy sessions</span>
          </div>
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{patientCounts.emergency}</span>
            <span className="recep-dash-card-label">Emergency arrivals</span>
          </div>
        </div>
      </section>

      {/* 4. Emergency Cases */}
      <section className="recep-dash-section recep-dash-emergency">
        <h2 className="recep-dash-section-title">Emergency Cases (Walk-in Psychiatric Crisis)</h2>
        <p className="recep-dash-hint">High priority. Quick register → Assign emergency tag → Alert duty doctor. Skips normal queue.</p>
        <button type="button" className="recep-btn recep-btn-emergency" onClick={handleAddEmergency}>
          + Add Emergency Patient
        </button>
        {emergencyQueue.length > 0 && (
          <div className="recep-emergency-list">
            {emergencyQueue.map((e) => (
              <div key={e.id} className="recep-emergency-item">
                <span className="recep-badge-emergency">HIGH PRIORITY</span>
                <span>{e.patientName || "Unnamed"} – {e.reason || "Emergency"}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Admission Requests (IPD) */}
      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">Admission Requests (IPD)</h2>
        <p className="recep-dash-hint">Check bed availability → Assign ward → Generate admission form → Inform nursing.</p>
        {admissionRequests.length === 0 ? (
          <p className="recep-table-empty">No admission requests</p>
        ) : (
          <ul className="recep-list">
            {admissionRequests.map((a) => (
              <li key={a.id}>{a.patientName} – {a.ward} – <button type="button" className="recep-btn recep-btn-small recep-btn-primary">Process</button></li>
            ))}
          </ul>
        )}
        <button type="button" className="recep-btn recep-btn-secondary" onClick={() => navigate("/receptionist/admissions")}>
          Go to Admissions
        </button>
      </section>
    </div>
  );
}
