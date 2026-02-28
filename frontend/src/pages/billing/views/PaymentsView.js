import React from "react";
import { dummyPayments } from "../billingDummyData";

function PaymentsView() {
  return (
    <div className="billing-content">
      <div className="billing-card">
        <h2 className="billing-card__heading">Payment History</h2>
        <div className="billing-table-wrap">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice</th>
                <th>Patient</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyPayments.map((p) => (
                <tr key={p.id}>
                  <td>{p.date}</td>
                  <td>{p.invoiceNumber}</td>
                  <td>{p.patientName}</td>
                  <td>{p.method}</td>
                  <td>₹{p.amount.toLocaleString()}</td>
                  <td><span className={`status-badge status-badge--${p.status.toLowerCase()}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentsView;
