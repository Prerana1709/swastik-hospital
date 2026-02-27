// Registration hub: central page at /registration. Cards navigate to sub-routes.
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";

function Registration() {
  const navigate = useNavigate();

  const cards = [
    { title: "Patient Registration", desc: "Register new patients and generate UHID", path: "/registration/patient" },
    { title: "Doctor Registration", desc: "Add doctors and assign departments", path: "/registration/doctor" },
    { title: "Staff Registration", desc: "Register nurses, reception and admin staff", path: "/registration/staff" },
    { title: "OPD Registration", desc: "Outpatient department registration", path: "/registration/opd" },
    { title: "IPD Admission", desc: "Inpatient admission and bed allocation", path: "/registration/ipd" },
  ];

  return (
    <div className="content-area">
      <h2>Registration</h2>
      <p className="section-subtitle">Select a registration category</p>
      <div className="registration-grid">
        {cards.map((card) => (
          <div key={card.path} className="registration-card">
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            <button type="button" onClick={() => navigate(card.path)}>
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Registration;
