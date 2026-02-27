import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const SAMPLE_TYPES = ["Blood", "Urine", "Swab", "Stool", "Other"];

function LabConfig() {
  const [tests, setTests] = useState([
    { id: 1, name: "CBC", normalRange: "12-16", criticalValue: "<8 or >20", cost: 150, sampleType: "Blood" },
  ]);
  const [name, setName] = useState("");
  const [normalRange, setNormalRange] = useState("");
  const [criticalValue, setCriticalValue] = useState("");
  const [cost, setCost] = useState("");
  const [sampleType, setSampleType] = useState("Blood");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setTests((prev) => [
      ...prev,
      { id: Date.now(), name: name.trim(), normalRange, criticalValue, cost: cost || 0, sampleType },
    ]);
    setName("");
    setNormalRange("");
    setCriticalValue("");
    setCost("");
  };

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Lab Test Configuration</h2>
      <p className="section-subtitle">Add lab tests and define normal range, critical value, cost, and sample type</p>

      <div className="impl-section">
        <h3>Add Lab Test</h3>
        <form onSubmit={handleAdd}>
          <div className="impl-form-row">
            <label>Test Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CBC" />
          </div>
          <div className="impl-form-row">
            <label>Normal Range</label>
            <input type="text" value={normalRange} onChange={(e) => setNormalRange(e.target.value)} placeholder="e.g. 12-16" />
          </div>
          <div className="impl-form-row">
            <label>Critical Value</label>
            <input type="text" value={criticalValue} onChange={(e) => setCriticalValue(e.target.value)} placeholder="e.g. less than 8" />
          </div>
          <div className="impl-form-row">
            <label>Cost (Rs)</label>
            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0" min="0" />
          </div>
          <div className="impl-form-row">
            <label>Sample Type</label>
            <select value={sampleType} onChange={(e) => setSampleType(e.target.value)}>
              {SAMPLE_TYPES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">Add Lab Test</button>
        </form>
      </div>

      <div className="impl-section">
        <h3>Configured Tests</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Test</th>
              <th>Normal Range</th>
              <th>Critical Value</th>
              <th>Cost</th>
              <th>Sample Type</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.normalRange || "—"}</td>
                <td>{t.criticalValue || "—"}</td>
                <td>{t.cost}</td>
                <td>{t.sampleType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LabConfig;
