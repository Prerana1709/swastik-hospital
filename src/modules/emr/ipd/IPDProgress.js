// Psychiatric IPD: Risk monitoring, daily notes, behavior log, sedation, therapy tracking, discharge readiness.
import React, { useState } from "react";
import { FaClipboardCheck, FaChevronDown, FaChevronRight } from "react-icons/fa";

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

const BEHAVIOR_LOG = [
  { time: "08:00", observation: "Calm, cooperative", risk: "Low" },
  { time: "12:00", observation: "Anxious, pacing", risk: "Moderate" },
  { time: "18:00", observation: "Improved after session", risk: "Low" },
];

function IPDProgress() {
  const [open, setOpen] = useState({ risk: true, notes: true, behavior: true, sedation: true, therapy: true, discharge: true });
  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="ipd-progress psych-ipd-progress">
      <h3><FaClipboardCheck /> Psychiatric IPD Progress</h3>
      <div className="progress-container">

        <Collapsible id="risk" title="Risk Level Monitoring" open={open.risk} onToggle={toggle}>
          <div className="form-grid">
            <div className="form-group">
              <label>Current Risk Level</label>
              <select>
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Last Assessed</label>
              <input type="datetime-local" />
            </div>
            <div className="form-group full-width">
              <label>Risk Assessment Notes</label>
              <textarea placeholder="Self-harm, violence, absconding risk..." rows="3" />
            </div>
          </div>
        </Collapsible>

        <Collapsible id="notes" title="Daily Psychiatric Notes" open={open.notes} onToggle={toggle}>
          <div className="progress-form">
            <div className="form-group">
              <label>Date & Time</label>
              <input type="datetime-local" />
            </div>
            <div className="form-group">
              <label>Mental State (MSE summary)</label>
              <textarea placeholder="Appearance, mood, affect, thought content, insight..." rows="4" />
            </div>
            <div className="form-group">
              <label>Assessment & Plan</label>
              <textarea placeholder="Clinical impression and plan for today..." rows="4" />
            </div>
            <button type="button" className="save-progress-btn">Save Daily Note</button>
          </div>
        </Collapsible>

        <Collapsible id="behavior" title="Behavior Observation Log" open={open.behavior} onToggle={toggle}>
          <div className="behavior-log-table">
            <div className="session-row header">
              <div>Time</div>
              <div>Observation</div>
              <div>Risk</div>
            </div>
            {BEHAVIOR_LOG.map((row, i) => (
              <div key={i} className="session-row">
                <div>{row.time}</div>
                <div>{row.observation}</div>
                <div><span className={`risk-badge risk-${row.risk.toLowerCase()}`}>{row.risk}</span></div>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label>Add Observation</label>
            <div className="form-grid" style={{ gridTemplateColumns: "1fr 2fr 1fr" }}>
              <input type="time" />
              <input placeholder="Observation..." />
              <select><option>Low</option><option>Moderate</option><option>High</option></select>
            </div>
          </div>
          <button type="button" className="add-session-btn">+ Add Entry</button>
        </Collapsible>

        <Collapsible id="sedation" title="Sedation Monitoring" open={open.sedation} onToggle={toggle}>
          <div className="form-grid">
            <div className="form-group">
              <label>PRN Sedation Given</label>
              <select><option>No</option><option>Yes</option></select>
            </div>
            <div className="form-group">
              <label>Drug & Dose</label>
              <input placeholder="e.g. Lorazepam 2mg" />
            </div>
            <div className="form-group">
              <label>Time Given</label>
              <input type="datetime-local" />
            </div>
            <div className="form-group full-width">
              <label>Response & Vital Signs (if applicable)</label>
              <textarea placeholder="Effect, sedation scale, BP/HR if recorded..." rows="2" />
            </div>
          </div>
        </Collapsible>

        <Collapsible id="therapy" title="Therapy Tracking" open={open.therapy} onToggle={toggle}>
          <div className="form-grid">
            <div className="form-group">
              <label>Session Date</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select><option>CBT</option><option>Counseling</option><option>Supportive</option><option>Group</option></select>
            </div>
            <div className="form-group full-width">
              <label>Session Summary</label>
              <textarea placeholder="Key themes, engagement, homework..." rows="3" />
            </div>
          </div>
          <button type="button" className="save-progress-btn">Log Therapy Session</button>
        </Collapsible>

        <Collapsible id="discharge" title="Discharge Readiness Evaluation" open={open.discharge} onToggle={toggle}>
          <div className="form-grid">
            <div className="form-group">
              <label>Readiness for Discharge</label>
              <select><option>Not ready</option><option>Under consideration</option><option>Ready</option></select>
            </div>
            <div className="form-group">
              <label>Target Discharge Date</label>
              <input type="date" />
            </div>
            <div className="form-group full-width">
              <label>Discharge Criteria Met / Pending</label>
              <textarea placeholder="Safety, insight, follow-up plan, medication adherence..." rows="4" />
            </div>
            <div className="form-group full-width">
              <label>Aftercare Plan</label>
              <textarea placeholder="OPD follow-up, therapy, crisis contact..." rows="3" />
            </div>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}

export default IPDProgress;
