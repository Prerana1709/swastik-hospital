import React, { useState, useMemo } from "react";
import { dummyInvoices } from "../billingDummyData";

function InvoicesView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    let list = dummyInvoices;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.patientName.toLowerCase().includes(q) ||
          inv.uhid.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((inv) => inv.status === statusFilter);
    }
    return list;
  }, [search, statusFilter]);

  return (
    <div className="billing-content">
      <div className="billing-card">
        <div className="billing-card__toolbar">
          <input
            type="text"
            className="billing-card__search"
            placeholder="Search by invoice #, patient, UHID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="billing-card__filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.patientName}</td>
                  <td>{inv.uhid}</td>
                  <td>{inv.issueDate}</td>
                  <td>{inv.dueDate}</td>
                  <td><span className={`status-badge status-badge--${inv.status.toLowerCase()}`}>{inv.status}</span></td>
                  <td>₹{inv.amount.toLocaleString()}</td>
                  <td>
                    <button type="button" className="billing-btn billing-btn--sm billing-btn--secondary">View</button>
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

export default InvoicesView;
