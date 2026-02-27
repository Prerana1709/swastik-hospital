// Rehab: Relapse monitoring, addiction recovery tracking, progress graph.
import React, { useState } from "react";
import { FaChartLine, FaChevronDown, FaChevronRight, FaSave } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Collapsible({ id, title, open, onToggle, children }) {
  return (
    <div className={`psych-section ${open ? "open" : "collapsed"}`}>
      <button type="button" className="psych-section-header" onClick={() => onToggle(id)} aria-expanded={open}>
        <span className="psych-section-icon">{open ? <FaChevronDown /> : <FaChevronRight />}</span>
        <span>{title}</span>
      </button>
      {open && <div className="psych-section-body">{children}</div>}
    </div>
  );
}



function RehabProgress({ rehabData, setRehabData, onSave }) {
  const [open, setOpen] = useState({ relapse: true, addiction: true, graph: true });
  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const updateField = (field, value) => {
    setRehabData(prev => ({ ...prev, [field]: value }));
  };

  // Map live sessions to graph data
  const chartData = (rehabData.sessions || []).map((s, i) => ({
    session: `S${i + 1}`,
    score: s.outcome
  }));

  return (
    <div className="rehab-progress psych-consultation">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3><FaChartLine /> Progress & Relapse Monitoring</h3>
        <button className="lab-btn lab-btn-primary" onClick={onSave}><FaSave /> Save Progress Updates</button>
      </div>

      <Collapsible id="relapse" title="Relapse Monitoring" open={open.relapse} onToggle={toggle}>
        <div className="form-grid">
          <div className="form-group">
            <label>Current Relapse Risk</label>
            <select value={rehabData.relapseRisk} onChange={(e) => updateField("relapseRisk", e.target.value)}>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
              <option>Extreme</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Detailed Relapse Prevention Strategy</label>
            <textarea
              placeholder="Triggers identified, coping mechanisms, emergency contacts..."
              rows="3"
              value={rehabData.relapseNotes || ""}
              onChange={(e) => updateField("relapseNotes", e.target.value)}
            />
          </div>
        </div>
      </Collapsible>

      <Collapsible id="addiction" title="Addiction Recovery Tracking" open={open.addiction} onToggle={toggle}>
        <div className="form-grid">
          <div className="form-group">
            <label>Current Status</label>
            <select value={rehabData.addictionStatus} onChange={(e) => updateField("addictionStatus", e.target.value)}>
              <option>Stable / Abstinant</option>
              <option>Occasional Cravings</option>
              <option>Frequent Cravings</option>
              <option>Lapse Recorded</option>
              <option>Relapsed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Days of Continuous Sobriety</label>
            <input
              type="number"
              value={rehabData.daysSobriety}
              onChange={(e) => updateField("daysSobriety", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-group full-width">
            <label>Recovery Milestones & Support Group Logs</label>
            <textarea
              placeholder="AA/NA attendance, milestone reached, peer support engagement..."
              rows="3"
              value={rehabData.progressLog || ""}
              onChange={(e) => updateField("progressLog", e.target.value)}
            />
          </div>
        </div>
      </Collapsible>

      <Collapsible id="graph" title="Visual Progress Trend (Latest Sessions)" open={open.graph} onToggle={toggle}>
        <div className="progress-graph-wrap" style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="session" tick={{ fill: "#555", fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fill: "#555", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e8e8e8" }} />
                <Bar dataKey="score" fill="#2f6f6c" name="Outcome Score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              Add sessions to see progress trend
            </div>
          )}
        </div>
        <p className="graph-caption">Session outcome scores over time (1–10). Higher is better.</p>
      </Collapsible>
    </div>
  );
}

export default RehabProgress;
