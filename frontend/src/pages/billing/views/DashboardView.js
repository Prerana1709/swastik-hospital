import React from "react";
import { dummyInvoices, dashboardMetrics } from "../billingDummyData";

const TITLES = {
  totalInvoices: "Total Invoices",
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  revenue: "Revenue",
  outstanding: "Outstanding",
};

function DashboardView({ metrics = dashboardMetrics }) {
  const cards = [
    { key: "totalInvoices", value: metrics.totalInvoices },
    { key: "paid", value: metrics.paid },
    { key: "pending", value: metrics.pending },
    { key: "overdue", value: metrics.overdue },
    { key: "revenue", value: `₹${(metrics.revenue / 100000).toFixed(2)} L` },
    { key: "outstanding", value: `₹${(metrics.outstanding / 1000).toFixed(0)}K` },
  ];

  return (
    <div className="billing-content">
      <div className="metric-card-grid">
        {cards.map(({ key, value }) => (
          <div key={key} className="metric-card">
            <span className="metric-card__title">{TITLES[key]}</span>
            <span className="metric-card__value">{value}</span>
          </div>
        ))}
      </div>
      <div className="billing-card">
        <h2 className="billing-card__heading">Recent Invoices</h2>
        <div className="billing-table-wrap">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient</th>
                <th>UHID</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {dummyInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.patientName}</td>
                  <td>{inv.uhid}</td>
                  <td>{inv.issueDate}</td>
                  <td>{inv.dueDate}</td>
                  <td><span className={`status-badge status-badge--${inv.status.toLowerCase()}`}>{inv.status}</span></td>
                  <td>₹{inv.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
