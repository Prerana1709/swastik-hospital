import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DUMMY_APPOINTMENTS = [
  { id: 1, time: "09:00", patientName: "Ramesh K.", uhid: "SWH001", type: "OPD", risk: "Low" },
  { id: 2, time: "09:30", patientName: "Priya S.", uhid: "SWH002", type: "Follow-up", risk: "Moderate" },
  { id: 3, time: "10:00", patientName: "Vikram S.", uhid: "SWH003", type: "OPD", risk: "High" },
  { id: 4, time: "10:30", patientName: "Anita D.", uhid: "SWH004", type: "New", risk: "Low" },
  { id: 5, time: "11:00", patientName: "Suresh P.", uhid: "SWH005", type: "Follow-up", risk: "Low" },
];

const SUMMARY_CARDS = [
  {
    key: "appointments",
    label: "Today's Appointments",
    value: 12,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
    )
  },
  {
    key: "highRisk",
    label: "High Risk Patients",
    value: 2,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    )
  },
  {
    key: "followUps",
    label: "Pending Follow-ups",
    value: 5,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    )
  },
  {
    key: "assessments",
    label: "Assessment Due",
    value: 3,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    )
  },
];

function DoctorDashboard() {
  const navigate = useNavigate();
  const [cards] = useState(SUMMARY_CARDS);

  const openConsultation = (apt) => {
    navigate("/doctor/consultation", {
      state: { patientId: apt.uhid, patientName: apt.patientName },
    });
  };

  return (
    <div className="doctor-dashboard">
      <h2 className="doctor-page-title">Dashboard</h2>
      <div className="doctor-cards">
        {cards.map((card) => (
          <div key={card.key} className="doctor-card doctor-metric-card">
            <div style={{ color: "var(--doc-primary)", marginBottom: "16px", background: "var(--doc-primary-light)", display: "inline-flex", padding: "12px", borderRadius: "12px", width: "fit-content" }}>
              {card.icon}
            </div>
            <span className="doctor-metric-card__label">{card.label}</span>
            <span className="doctor-metric-card__value">{card.value}</span>
          </div>
        ))}
      </div>
      <div className="doctor-card doctor-dashboard-table-wrap">
        <h3 className="doctor-card__heading">Upcoming Appointments</h3>
        <div className="doctor-table-wrap">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>UHID</th>
                <th>Type</th>
                <th>Risk</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_APPOINTMENTS.map((apt) => (
                <tr key={apt.id}>
                  <td>{apt.time}</td>
                  <td>{apt.patientName}</td>
                  <td>{apt.uhid}</td>
                  <td>{apt.type}</td>
                  <td>
                    <span className={`doctor-risk-badge doctor-risk-badge--${apt.risk.toLowerCase()}`}>
                      {apt.risk}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="doctor-btn doctor-btn--sm doctor-btn--primary"
                      onClick={() => openConsultation(apt)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
