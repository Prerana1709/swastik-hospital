// Activity Logs: mock activity data, filter by date and module. Local state only.
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../implementer/implementer.css";

const MOCK_LOGS = [
  { id: 1, timestamp: "2025-02-06 09:15", user: "Dr. Sharma", module: "Clinical", action: "Viewed patient record" },
  { id: 2, timestamp: "2025-02-06 09:10", user: "Priya Nair", module: "Registration", action: "Registered new patient" },
  { id: 3, timestamp: "2025-02-06 08:55", user: "Vikram Singh", module: "Lab", action: "Entered lab result" },
  { id: 4, timestamp: "2025-02-05 16:30", user: "Dr. Kumar", module: "Reports", action: "Generated daily summary" },
  { id: 5, timestamp: "2025-02-05 14:00", user: "Admin", module: "Admin", action: "Updated user role" },
  { id: 6, timestamp: "2025-02-05 11:20", user: "Meera Iyer", module: "Registration", action: "Updated OPD visit" },
];

const MODULES = ["All", "Registration", "Clinical", "Lab", "Reports", "Admin"];

function AdminLogs() {
  const [logs] = useState(MOCK_LOGS);
  const [dateFilter, setDateFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchDate = !dateFilter || log.timestamp.startsWith(dateFilter);
      const matchModule = moduleFilter === "All" || log.module === moduleFilter;
      return matchDate && matchModule;
    });
  }, [logs, dateFilter, moduleFilter]);

  return (
    <div className="content-area impl-page">
      <Link to="/admin" className="impl-back-link">
        <FaArrowLeft /> Back to Admin
      </Link>
      <h2>Activity Logs</h2>
      <p className="section-subtitle">View and filter activity by date and module (mock data)</p>

      <div className="impl-section">
        <h3>Filters</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
          <div className="impl-form-row" style={{ marginBottom: 0 }}>
            <label>Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ maxWidth: 200 }}
            />
          </div>
          <div className="impl-form-row" style={{ marginBottom: 0 }}>
            <label>Module</label>
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} style={{ maxWidth: 200 }}>
              {MODULES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="impl-section">
        <h3>Logs ({filtered.length})</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Module</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id}>
                <td>{log.timestamp}</td>
                <td>{log.user}</td>
                <td>{log.module}</td>
                <td>{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminLogs;
