import React from "react";
import { dummyInvoices, dashboardMetrics } from "../billingDummyData";

const TITLES = {
  totalInvoices: "Total Invoices",
  paid: "Paid",
  pending: "Pending",
  revenue: "Revenue",
  outstanding: "Outstanding",
};

function DashboardView({ metrics = dashboardMetrics }) {
  const cards = [
    {
      key: "totalInvoices",
      value: metrics.totalInvoices,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    },
    {
      key: "paid",
      value: metrics.paid,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    },
    {
      key: "pending",
      value: metrics.pending,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    },

    {
      key: "revenue",
      value: `₹${(metrics.revenue / 100000).toFixed(2)} L`,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    },
    {
      key: "outstanding",
      value: `₹${(metrics.outstanding / 1000).toFixed(0)}K`,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
    },
  ];

  return (
    <div className="billing-content">
      <div className="metric-card-grid">
        {cards.map(({ key, value, icon }) => (
          <div key={key} className="metric-card">
            <div style={{ color: "var(--bill-primary)", marginBottom: "16px", background: "var(--bill-primary-light)", display: "inline-flex", padding: "12px", borderRadius: "12px", width: "fit-content", position: "relative", zIndex: 1 }}>
              {icon}
            </div>
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
