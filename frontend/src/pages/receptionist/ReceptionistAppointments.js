import React, { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { getTodayAppointments, getPendingRequests } from "./receptionistData";
import "./ReceptionistDashboard.css";

export default function ReceptionistAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    setAppointments(getTodayAppointments());
    setPending(getPendingRequests());
  }, []);

  return (
    <div className="recep-dash">
      <h1 className="recep-dash-title">Appointments Schedule</h1>
      <p className="recep-dash-subtitle">Manage today&apos;s surgical and clinical appointments.</p>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiCalendar /> Today&apos;s Appointments</h2>
        <div className="recep-table-wrap">
          <table className="recep-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Assigned Doctor</th>
                <th>Time Slot</th>
                <th>Visit Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan={5} className="recep-table-empty">No appointments scheduled for today.</td></tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.patientName}</strong></td>
                    <td>{a.doctor}</td>
                    <td><FiClock style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {a.time}</td>
                    <td><span className="recep-status recep-status-pending">{a.type || "OPD"}</span></td>
                    <td><span className={`recep-status recep-status-${a.status}`}>{a.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiClock /> Pending Requests</h2>
        <div className="recep-table-wrap">
          <table className="recep-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Requested Doctor</th>
                <th>Proposed Date & Time</th>
                <th>Appointment Type</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={4} className="recep-table-empty">No pending clinical requests.</td></tr>
              ) : (
                pending.map((req) => (
                  <tr key={req.id}>
                    <td><strong>{req.patientName}</strong></td>
                    <td>{req.doctor}</td>
                    <td>{req.date} at {req.time}</td>
                    <td><span className="recep-status recep-status-pending">{req.type || "OPD"}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
