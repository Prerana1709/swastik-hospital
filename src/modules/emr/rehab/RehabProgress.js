// Rehab: Relapse monitoring, addiction recovery tracking, progress graph.
import React, { useState } from "react";
import { FaChartLine, FaChevronDown, FaChevronRight } from "react-icons/fa";
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

const PROGRESS_DATA = [
  { session: "S1", score: 4 }, { session: "S2", score: 5 }, { session: "S3", score: 6 },
  { session: "S4", score: 5 }, { session: "S5", score: 7 }, { session: "S6", score: 8 },
  { session: "S7", score: 7 }, { session: "S8", score: 9 },
];

function RehabProgress() {
  const [open, setOpen] = useState({ relapse: true, addiction: true, graph: true });
  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="rehab-progress">
      <h3><FaChartLine /> Progress & Relapse Monitoring</h3>

      <Collapsible id="relapse" title="Relapse Monitoring" open={open.relapse} onToggle={toggle}>
        <div className="form-grid">
          <div className="form-group">
            <label>Relapse Risk (Current)</label>
            <select><option>Low</option><option>Moderate</option><option>High</option></select>
          </div>
          <div className="form-group">
            <label>Last Relapse (if any)</label>
            <input type="date" placeholder="Date" />
          </div>
          <div className="form-group full-width">
            <label>Relapse / Worsening Notes</label>
            <textarea placeholder="Triggers, symptoms, action taken..." rows="3" />
          </div>
          <div className="form-group full-width">
            <label>Relapse Prevention Plan</label>
            <textarea placeholder="Early warning signs, coping strategies, emergency contact..." rows="3" />
          </div>
        </div>
      </Collapsible>

      <Collapsible id="addiction" title="Addiction Recovery Tracking" open={open.addiction} onToggle={toggle}>
        <div className="form-grid">
          <div className="form-group">
            <label>Substance (if applicable)</label>
            <select><option>—</option><option>Alcohol</option><option>Nicotine</option><option>Other</option></select>
          </div>
          <div className="form-group">
            <label>Days Since Last Use</label>
            <input type="number" placeholder="0" min={0} />
          </div>
          <div className="form-group">
            <label>CRAFFT / ASSIST Score (if done)</label>
            <input placeholder="—" />
          </div>
          <div className="form-group full-width">
            <label>Recovery Notes</label>
            <textarea placeholder="Compliance, cravings, support engagement..." rows="3" />
          </div>
        </div>
      </Collapsible>

      <Collapsible id="graph" title="Progress Graph (Session Outcome Scores)" open={open.graph} onToggle={toggle}>
        <div className="progress-graph-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={PROGRESS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="session" tick={{ fill: "#555", fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fill: "#555", fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e8e8e8" }} />
              <Bar dataKey="score" fill="#2f6f6c" name="Outcome Score" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="graph-caption">Session outcome scores over time (1–10). Higher is better.</p>
      </Collapsible>
    </div>
  );
}

export default RehabProgress;
