import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiCalendar, FiClock, FiCheckCircle, FiActivity, FiBriefcase, FiAlertTriangle, FiPlus } from 'react-icons/fi';
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
      <h1 className="recep-dash-title">Reception Dashboard</h1>
      <p className="recep-dash-subtitle">Welcome back. Here is what&apos;s happening at the hospital today.</p>

      {/* Quick Action – prominent */}
      <section className="recep-dash-quick-reg">
        <div className="recep-quick-info">
          <h2 style={{ margin: 0, color: '#0f172a' }}>Patient Onboarding</h2>
          <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>Quickly register new arrivals to the hospital system.</p>
        </div>
        <button type="button" className="recep-quick-reg-btn" onClick={() => navigate("/receptionist/patients/register")}>
          <FiPlus /> Register New Patient
        </button>
      </section>

      {/* 1. Today's Appointments */}
      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiCalendar /> Today&apos;s Appointments</h2>
        <div className="recep-dash-cards">
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon"><FiCalendar /></div>
            <span className="recep-dash-card-value">{appointments.length}</span>
            <span className="recep-dash-card-label">Total Scheduled</span>
          </div>
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}><FiCheckCircle /></div>
            <span className="recep-dash-card-value">{confirmed}</span>
            <span className="recep-dash-card-label">Confirmed</span>
          </div>
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}><FiClock /></div>
            <span className="recep-dash-card-value">{pendingCount}</span>
            <span className="recep-dash-card-label">Pending Approval</span>
          </div>
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon" style={{ backgroundColor: '#f8fafc', color: '#475569' }}><FiActivity /></div>
            <span className="recep-dash-card-value">{completed}</span>
            <span className="recep-dash-card-label">Completed</span>
          </div>
        </div>

        {doctorAbsent && (
          <div className="recep-dash-warning">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FiAlertTriangle style={{ fontSize: '1.25rem' }} />
              <span><strong>Doctor Not Available:</strong> {doctorAbsent.name} is currently out of office.</span>
            </div>
            <div className="recep-dash-warning-actions">
              <span className="recep-dash-alt-slots">Alt slots: 2 PM, 4 PM</span>
              <button type="button" className="recep-btn recep-btn-primary">Notify Patients</button>
            </div>
          </div>
        )}
      </section>

      {/* 2. Pending Appointment Requests */}
      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiClock /> Pending Appointment Requests</h2>
        <div className="recep-table-wrap">
          <table className="recep-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Desired Schedule</th>
                <th>Visit Type</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={5} className="recep-table-empty">No pending requests at the moment.</td></tr>
              ) : (
                pending.map((req) => (
                  <tr key={req.id}>
                    <td><strong>{req.patientName}</strong></td>
                    <td>{req.doctor}</td>
                    <td>{req.date} at {req.time}</td>
                    <td><span className="recep-status recep-status-pending">{req.type || "OPD"}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button type="button" className="recep-btn recep-btn-small recep-btn-primary" onClick={() => handleConfirmRequest(req)}>Confirm</button>
                      <button type="button" className="recep-btn recep-btn-small recep-btn-secondary" onClick={() => handleRescheduleRequest(req)}>Reschedule</button>
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
        <h2 className="recep-dash-section-title"><FiUsers /> Daily Patient Metrics</h2>
        <div className="recep-dash-cards">
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon"><FiUsers /></div>
            <span className="recep-dash-card-value">{patientCounts.total}</span>
            <span className="recep-dash-card-label">Total Arrivals</span>
          </div>
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon"><FiActivity /></div>
            <span className="recep-dash-card-value">{patientCounts.opd}</span>
            <span className="recep-dash-card-label">OPD Walk-ins</span>
          </div>
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon"><FiClock /></div>
            <span className="recep-dash-card-value">{patientCounts.followUp}</span>
            <span className="recep-dash-card-label">Follow-up Visits</span>
          </div>
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}><FiAlertTriangle /></div>
            <span className="recep-dash-card-value">{patientCounts.emergency}</span>
            <span className="recep-dash-card-label">Psychiatric Crisis</span>
          </div>
        </div>
      </section>

      {/* 4. Emergency Cases */}
      <section className="recep-dash-section recep-dash-emergency">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 className="recep-dash-section-title" style={{ marginBottom: '0.5rem' }}>Crisis Management</h2>
            <p style={{ color: '#991b1b', fontSize: '0.9rem', margin: 0 }}>High priority alerts for walk-in psychiatric emergencies.</p>
          </div>
          <button type="button" className="recep-btn-emergency" onClick={handleAddEmergency}>
            <FiAlertTriangle /> Initiate Emergency Protocol
          </button>
        </div>

        {emergencyQueue.length > 0 ? (
          <div className="recep-emergency-list">
            {emergencyQueue.map((e) => (
              <div key={e.id} className="recep-emergency-item">
                <span className="recep-badge-emergency">IMMEDIATE ATTENTION</span>
                <span style={{ fontWeight: 600 }}>{e.patientName || "Unnamed Patient"}</span>
                <span style={{ color: '#64748b' }}>&bull; {e.reason || "Psychiatric Crisis"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#991b1b', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
            No active psychiatric emergency cases.
          </div>
        )}
      </section>

      {/* 5. Admission Requests (IPD) */}
      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiBriefcase /> Admission Pipeline (IPD)</h2>
        <div className="recep-table-wrap" style={{ padding: '1rem' }}>
          {admissionRequests.length === 0 ? (
            <p className="recep-table-empty">No pending admission requests.</p>
          ) : (
            <ul className="recep-list" style={{ listStyle: 'none', padding: 0 }}>
              {admissionRequests.map((a) => (
                <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <FiUsers />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.patientName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Assigned Ward: {a.ward}</div>
                    </div>
                  </div>
                  <button type="button" className="recep-btn recep-btn-primary">Process Admission</button>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="recep-btn recep-btn-secondary" onClick={() => navigate("/receptionist/admissions")}>
              View All Admissions &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
