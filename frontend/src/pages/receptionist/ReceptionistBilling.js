import React from "react";
import "./ReceptionistDashboard.css";

export default function ReceptionistBilling() {
  return (
    <div className="recep-dash">
      <h1 className="recep-dash-title">Billing</h1>
      <p className="recep-dash-subtitle">Generate bills and collect payments. (Receptionist can generate bill; cannot view diagnosis.)</p>
      <section className="recep-dash-section">
        <p className="recep-table-empty">Billing workflow: Search patient by UHID → Select services → Generate bill → Collect payment.</p>
        <button type="button" className="recep-btn recep-btn-primary" style={{ marginTop: 12 }}>New Bill</button>
      </section>
    </div>
  );
}
