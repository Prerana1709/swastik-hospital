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
  { key: "appointments", label: "Today's Appointments", value: 12 },
  { key: "highRisk", label: "High Risk Patients", value: 2 },
  { key: "followUps", label: "Pending Follow-ups", value: 5 },
  { key: "assessments", label: "Assessment Due", value: 3 },
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
