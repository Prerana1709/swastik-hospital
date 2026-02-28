import React from "react";
import { dummyPatients } from "../billingDummyData";

function ClientsView() {
  return (
    <div className="billing-content">
      <div className="billing-card">
        <h2 className="billing-card__heading">Clients (Patients) – Billing Summary</h2>
        <div className="billing-table-wrap">
          <table className="billing-table">
            <thead>
              <tr>
                <th>UHID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Total Billed</th>
                <th>Total Paid</th>
                <th>Outstanding</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyPatients.map((p) => (
                <tr key={p.uhid}>
                  <td>{p.uhid}</td>
                  <td>{p.fullName}</td>
                  <td>{p.contact}</td>
                  <td>₹{p.totalBilled.toLocaleString()}</td>
                  <td>₹{p.totalPaid.toLocaleString()}</td>
                  <td>₹{p.outstanding.toLocaleString()}</td>
                  <td>
                    <button type="button" className="billing-btn billing-btn--sm billing-btn--secondary">Invoices</button>
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

export default ClientsView;
