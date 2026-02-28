import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import EMR from "./components/EMR";
import "./doctor.css";

function DoctorConsultation() {
  const location = useLocation();
  const params = useParams();
  const uhid = params.uhid;
  const statePatientId = location.state?.patientId;
  const statePatientName = location.state?.patientName;

  const patientId = uhid || statePatientId;
  const patientName = statePatientName || (patientId ? `Patient ${patientId}` : null);

  if (!patientId || !patientName) {
    return (
      <>
        <h2 className="doctor-page-title">New Consultation</h2>
        <div className="doctor-card">
          <p className="doctor-emr-subtitle">Select a patient to open EMR</p>
          <p>
            Go to <Link to="/doctor">Dashboard</Link> or{" "}
            <Link to="/doctor/appointments">Today's Appointments</Link> or{" "}
            <Link to="/doctor/patients">Patient List</Link> and click &quot;Open&quot; or
            &quot;Open EMR&quot; to start a consultation.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="doctor-page-title">Consultation – {patientName}</h2>
      <EMR patientId={patientId} patientName={patientName} />
    </>
  );
}

export default DoctorConsultation;
