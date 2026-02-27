// Psychiatric IPD Progress: Integrated with live clinical persistence and risk monitoring.
import React, { useState } from "react";
import { FaClipboardCheck, FaChevronDown, FaChevronRight, FaSave, FaPlus } from "react-icons/fa";

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

function IPDProgress({ progressData, setProgressData, onSave }) {
  const [open, setOpen] = useState({ risk: true, notes: true, behavior: true, therapy: true });
  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const updateField = (field, value) => {
    setProgressData(prev => ({ ...prev, [field]: value }));
  };

  const addBehaviorLog = (log) => {
    setProgressData(prev => ({
      ...prev,
      behaviorLogs: [...(prev.behaviorLogs || []), log]
    }));
  };

  return (
    <div className="ipd-progress psych-ipd-progress">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3><FaClipboardCheck /> Psychiatric IPD Progress</h3>
        <button className="lab-btn lab-btn-primary" onClick={onSave}><FaSave /> Save Progress Record</button>
      </div>

      <div className="progress-container">
        <Collapsible id="risk" title="Risk Level Monitoring" open={open.risk} onToggle={toggle}>
          <div className="form-grid">
            <div className="form-group">
              <label>Current Risk Level</label>
              <select value={progressData.riskLevel} onChange={(e) => updateField("riskLevel", e.target.value)}>
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Risk Assessment Notes</label>
              <textarea
                placeholder="Self-harm, violence, absconding risk..."
                rows="2"
                value={progressData.riskNotes || ""}
                onChange={(e) => updateField("riskNotes", e.target.value)}
              />
            </div>
          </div>
        </Collapsible>

        <Collapsible id="notes" title="Daily Psychiatric Notes" open={open.notes} onToggle={toggle}>
          <div className="progress-form">
            <div className="form-group">
              <label>General Progress / MSE Summary for Today</label>
              <textarea
                placeholder="Appearance, mood, affect, thought content, insight..."
                rows="6"
                value={progressData.dailyNote || ""}
                onChange={(e) => updateField("dailyNote", e.target.value)}
              />
            </div>
          </div>
        </Collapsible>

        <Collapsible id="behavior" title="Behavior Observation Log" open={open.behavior} onToggle={toggle}>
          <div className="behavior-log-table">
            <div className="session-row header">
              <div>Time</div>
              <div>Observation</div>
              <div>Risk</div>
            </div>
            {(progressData.behaviorLogs || []).map((row, i) => (
              <div key={i} className="session-row">
                <div>{row.time}</div>
                <div>{row.observation}</div>
                <div><span className={`risk-badge risk-${row.risk.toLowerCase()}`}>{row.risk}</span></div>
              </div>
            ))}
            {(!progressData.behaviorLogs || progressData.behaviorLogs.length === 0) && (
              <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>No entries for today</div>
            )}
          </div>
          <div className="form-group" style={{ marginTop: "15px" }}>
            <button type="button" className="lab-btn lab-btn-secondary" onClick={() => {
              const obs = prompt("Enter observation:");
              if (obs) addBehaviorLog({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), observation: obs, risk: "Low" });
            }}>
              <FaPlus /> Quick Log Entry
            </button>
          </div>
        </Collapsible>

        <Collapsible id="therapy" title="Therapy Tracking" open={open.therapy} onToggle={toggle}>
          <div className="form-group full-width">
            <label>Therapy Session Summary</label>
            <textarea
              placeholder="Key themes, engagement, homework..."
              rows="4"
              value={progressData.therapySummary || ""}
              onChange={(e) => updateField("therapySummary", e.target.value)}
            />
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

export default IPDProgress;
