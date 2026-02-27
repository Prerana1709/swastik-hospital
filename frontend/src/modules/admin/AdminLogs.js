// Activity Logs: fetch activity data from backend, filter by date and module.
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../implementer/implementer.css";
import { api } from "../../api/service";

const MODULES = ["All", "Registration", "Clinical", "Lab", "Reports", "Admin", "Patient Records"];

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminLogs();
      setLogs(data);
    } catch (err) {
      setError("Failed to fetch logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      <p className="section-subtitle">Real-time website activity logs from the backend</p>

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
          <button onClick={fetchLogs} className="impl-btn impl-btn-secondary" style={{ marginBottom: 5 }}>
            Refresh
          </button>
        </div>
      </div>

      <div className="impl-section">
        <h3>Logs ({loading ? "..." : filtered.length})</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading ? <p>Loading logs...</p> : (
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#666' }}>No logs found.</td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log._id}>
                    <td>{log.timestamp}</td>
                    <td>{log.user}</td>
                    <td>{log.module}</td>
                    <td>{log.action}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminLogs;
