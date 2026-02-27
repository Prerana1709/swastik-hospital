// Psychiatric Rehab Sessions: Integrated with live clinical persistence.
import React from "react";
import { FaCalendarCheck, FaPlus, FaSave } from "react-icons/fa";

function RehabSessions({ rehabData, setRehabData, onSave }) {
  const sessions = rehabData.sessions || [];
  const [newSession, setNewSession] = React.useState({
    duration: "45",
    therapist: rehabData.assignedTherapist || "Dr. Nikhil Chougule",
    outcome: 8,
    sentiment: "Cooperative",
    notes: ""
  });

  const addSession = (session) => {
    setRehabData(prev => ({
      ...prev,
      sessions: [...(prev.sessions || []), {
        ...session,
        id: Date.now(),
        date: new Date().toLocaleDateString('en-IN'),
        type: rehabData.therapyType || "CBT"
      }]
    }));
    setNewSession(prev => ({ ...prev, notes: "" }));
  };

  return (
    <div className="rehab-sessions psych-consultation">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3><FaCalendarCheck /> Rehab Therapy Sessions</h3>
        <button className="lab-btn lab-btn-primary" onClick={onSave}><FaSave /> Save Session History</button>
      </div>

      <div className="add-session-form" style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "30px" }}>
        <h4 style={{ margin: "0 0 15px 0", color: "#2f6f6c" }}>Log New Live Session</h4>
        <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div className="form-group">
            <label>Duration (mins)</label>
            <input type="number" value={newSession.duration} onChange={(e) => setNewSession(s => ({ ...s, duration: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Outcome Score (1-10)</label>
            <select value={newSession.outcome} onChange={(e) => setNewSession(s => ({ ...s, outcome: parseInt(e.target.value) }))}>
              {[...Array(10)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Patient Sentiment</label>
            <select value={newSession.sentiment} onChange={(e) => setNewSession(s => ({ ...s, sentiment: e.target.value }))}>
              <option>Cooperative</option>
              <option>Resistant</option>
              <option>Emotional</option>
              <option>Withdrawn</option>
              <option>Motivated</option>
            </select>
          </div>
        </div>
        <div className="form-group" style={{ marginTop: "15px" }}>
          <label>Session Notes & Clinical Observations</label>
          <textarea
            placeholder="Describe patient engagement, key topics discussed, and clinical progress..."
            rows="3"
            value={newSession.notes}
            onChange={(e) => setNewSession(s => ({ ...s, notes: e.target.value }))}
          />
        </div>
        <button
          className="lab-btn lab-btn-secondary"
          style={{ marginTop: "10px" }}
          onClick={() => {
            if (!newSession.notes) return alert("Please enter session notes");
            addSession(newSession);
          }}
        >
          <FaPlus /> Add Session to Record
        </button>
      </div>

      <div className="sessions-table">
        <div className="session-row header" style={{ gridTemplateColumns: "120px 100px 100px 120px 1fr" }}>
          <div>Date</div>
          <div>Type</div>
          <div>Mins</div>
          <div>Outcome</div>
          <div>Clinical Notes</div>
        </div>
        {sessions.map((session, index) => (
          <div key={index} className="session-row" style={{ gridTemplateColumns: "120px 100px 100px 120px 1fr" }}>
            <div>{session.date}</div>
            <div>{session.type}</div>
            <div>{session.duration}m</div>
            <div>
              <span className="outcome-score" style={{ background: session.outcome > 7 ? "#dcfce7" : session.outcome > 4 ? "#fef9c3" : "#fee2e2" }}>
                {session.outcome}/10
              </span>
              <small style={{ display: "block", fontSize: "10px", color: "#666" }}>{session.sentiment}</small>
            </div>
            <div style={{ fontSize: "0.9rem", color: "#444" }}>{session.notes}</div>
          </div>
        ))}
        {sessions.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#666", background: "#f9f9f9", borderRadius: "8px" }}>
            No sessions logged yet for this patient.
          </div>
        )}
      </div>
    </div>
  );
}

export default RehabSessions;
