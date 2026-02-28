import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./doctor.css";

const MOCK_APPOINTMENTS = [
  { id: 1, time: "09:00", patient: "Patient A", uhid: "UHID001", type: "Follow-up", risk: "moderate" },
  { id: 2, time: "10:30", patient: "Patient B", uhid: "UHID002", type: "New", risk: "low" },
  { id: 3, time: "14:00", patient: "Patient C", uhid: "UHID003", type: "Follow-up", risk: "high" },
];

function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments] = useState(MOCK_APPOINTMENTS);

  const openConsultation = (row) => {
    navigate("/doctor/consultation", {
      state: { patientId: row.uhid, patientName: row.patient },
    });
  };

  return (
    <>
      <h2 className="doctor-page-title">Today's Appointments</h2>
      <div className="doctor-card">
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
              {appointments.map((row) => (
                <tr key={row.id}>
                  <td>{row.time}</td>
                  <td>{row.patient}</td>
                  <td>{row.uhid}</td>
                  <td>{row.type}</td>
                  <td>
                    <span
                      className={`doctor-risk-badge doctor-risk-badge--${row.risk}`}
                    >
                      {row.risk}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="doctor-btn doctor-btn--primary doctor-btn--sm"
                      onClick={() => openConsultation(row)}
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
    </>
  );
}

export default DoctorAppointments;
