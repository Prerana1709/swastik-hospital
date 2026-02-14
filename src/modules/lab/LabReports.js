// Lab reports: analytics cards, filters, table, export (PDF/CSV mock).
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./lab.css";

const MOCK_REPORTS = [
  { patient: "Ramesh Patil", test: "CBC", date: "06-Nov-2024", status: "Completed" },
  { patient: "Sunita Kulkarni", test: "LFT", date: "05-Nov-2024", status: "Completed" },
  { patient: "Amit Joshi", test: "HbA1c", date: "04-Nov-2024", status: "Completed" },
];

const MOCK_ANALYTICS = {
  totalTestsToday: 42,
  criticalResults: 2,
  avgTurnaroundMins: 85,
};

function LabReports() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [testName, setTestName] = useState("");
  const [uhid, setUhid] = useState("");

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    console.log("Export PDF (mock)");
    alert("Export PDF – mock. (Check console)");
  };

  const handleExportCSV = () => {
    console.log("Export CSV (mock)");
    alert("Export CSV – mock. (Check console)");
  };

  return (
    <div className="content-area lab-page">
      <Link to="/lab" className="lab-back-link no-print">
        <FaArrowLeft /> Back to Lab
      </Link>
      <h2>Lab Reports</h2>
      <p className="section-subtitle">Search and view/print reports</p>

      {/* Analytics cards */}
      <div className="lab-reports-stats no-print">
        <div className="lab-stat-card">
          <div className="label">Total Tests Today</div>
          <div className="value">{MOCK_ANALYTICS.totalTestsToday}</div>
        </div>
        <div className="lab-stat-card">
          <div className="label">Critical Results</div>
          <div className="value">{MOCK_ANALYTICS.criticalResults}</div>
        </div>
        <div className="lab-stat-card">
          <div className="label">Avg Turnaround Time</div>
          <div className="value">{MOCK_ANALYTICS.avgTurnaroundMins} min</div>
        </div>
      </div>

      <div className="lab-section no-print">
        <h3>Filters</h3>
        <div className="lab-filters">
          <div className="form-group">
            <label>Date From</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Date To</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Test Name</label>
            <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Test name" />
          </div>
          <div className="form-group">
            <label>Patient UHID</label>
            <input type="text" value={uhid} onChange={(e) => setUhid(e.target.value)} placeholder="UHID" />
          </div>
        </div>
      </div>

      <div className="lab-section">
        <div className="no-print" style={{ marginBottom: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="lab-btn lab-btn-secondary" onClick={handlePrint}>
            Print
          </button>
          <button type="button" className="lab-btn lab-btn-secondary" onClick={handleExportPDF}>
            Export PDF
          </button>
          <button type="button" className="lab-btn lab-btn-secondary" onClick={handleExportCSV}>
            Export CSV
          </button>
        </div>
        <table className="lab-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Test</th>
              <th>Date</th>
              <th>Status</th>
              <th className="no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REPORTS.map((r, i) => (
              <tr key={i}>
                <td>{r.patient}</td>
                <td>{r.test}</td>
                <td>{r.date}</td>
                <td>{r.status}</td>
                <td className="no-print">
                  <button type="button" className="lab-btn lab-btn-secondary" style={{ marginRight: 8 }}>
                    View
                  </button>
                  <button type="button" className="lab-btn lab-btn-secondary" onClick={handlePrint}>
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LabReports;
