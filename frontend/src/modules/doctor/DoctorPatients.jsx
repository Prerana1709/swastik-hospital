import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./doctor.css";

const MOCK_PATIENTS = [
  { uhid: "UHID001", name: "Patient A", lastVisit: "2025-02-20" },
  { uhid: "UHID002", name: "Patient B", lastVisit: "2025-02-22" },
  { uhid: "UHID003", name: "Patient C", lastVisit: "2025-02-25" },
];

function DoctorPatients() {
  const navigate = useNavigate();
  const [patients] = useState(MOCK_PATIENTS);

  const openConsultation = (p) => {
    navigate("/doctor/consultation", {
      state: { patientId: p.uhid, patientName: p.name },
    });
  };

  return (
    <>
      <h2 className="doctor-page-title">Patient List</h2>
      <div className="doctor-card">
        <div className="doctor-table-wrap">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>UHID</th>
                <th>Name</th>
                <th>Last Visit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.uhid}>
                  <td>{p.uhid}</td>
                  <td>{p.name}</td>
                  <td>{p.lastVisit}</td>
                  <td>
                    <button
                      type="button"
                      className="doctor-btn doctor-btn--primary doctor-btn--sm"
                      onClick={() => openConsultation(p)}
                    >
                      Open EMR
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

export default DoctorPatients;
