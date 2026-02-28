import React, { useState, useEffect } from "react";
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
      <h1 className="recep-dash-title">Appointments</h1>
      <p className="recep-dash-subtitle">Today&apos;s schedule and pending requests.</p>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">Today&apos;s Appointments</h2>
        <div className="recep-table-wrap">
          <table className="recep-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan={5} className="recep-table-empty">No appointments today</td></tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.patientName}</td>
                    <td>{a.doctor}</td>
                    <td>{a.time}</td>
                    <td>{a.type || "OPD"}</td>
                    <td><span className={`recep-status recep-status-${a.status}`}>{a.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">Pending Requests</h2>
        <div className="recep-table-wrap">
          <table className="recep-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr><td colSpan={4} className="recep-table-empty">No pending requests</td></tr>
              ) : (
                pending.map((req) => (
                  <tr key={req.id}>
                    <td>{req.patientName}</td>
                    <td>{req.doctor}</td>
                    <td>{req.date} {req.time}</td>
                    <td>{req.type || "OPD"}</td>
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
