import React, { useState, useEffect } from "react";

const LOCK_AFTER_HOURS = 24;
const ROLE = "Psychiatrist";

function SOAPNotes({ value = {}, onChange }) {
  const [s, setS] = useState(value.s ?? "");
  const [o, setO] = useState(value.o ?? "");
  const [a, setA] = useState(value.a ?? "");
  const [p, setP] = useState(value.p ?? "");
  const [savedAt, setSavedAt] = useState(value.savedAt ?? null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!savedAt) return;
    const saved = new Date(savedAt);
    const now = new Date();
    const hours = (now - saved) / (1000 * 60 * 60);
    setLocked(hours >= LOCK_AFTER_HOURS);
  }, [savedAt]);

  useEffect(() => {
    onChange({ s, o, a, p, savedAt, role: ROLE });
  }, [s, o, a, p, savedAt]);

  const handleSave = () => {
    setSavedAt(new Date().toISOString());
  };

  const disabled = locked;

  return (
    <div className="doctor-soap">
      <div className="doctor-soap-header">
        <h4 className="doctor-emr-subtitle">SOAP Notes</h4>
        {savedAt && (
          <span className="doctor-soap-meta">
            Last saved: {new Date(savedAt).toLocaleString()} · {ROLE}
          </span>
        )}
        {locked && (
          <span className="doctor-soap-locked" title="Note locked after 24 hours">
            🔒 Locked
          </span>
        )}
        {!locked && (
          <button type="button" className="doctor-btn doctor-btn--primary" onClick={handleSave}>
            Save Note
          </button>
        )}
      </div>
      <div className="doctor-soap-grid">
        <div className="doctor-form-group doctor-form-group--full">
          <label>S (Subjective)</label>
          <textarea
            rows={4}
            value={s}
            onChange={(e) => setS(e.target.value)}
            placeholder="Patient's reported symptoms and concerns"
            disabled={disabled}
          />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>O (Objective)</label>
          <textarea
            rows={4}
            value={o}
            onChange={(e) => setO(e.target.value)}
            placeholder="Observable findings, vitals, MSE"
            disabled={disabled}
          />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>A (Assessment)</label>
          <textarea
            rows={4}
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="Clinical assessment, diagnosis impression"
            disabled={disabled}
          />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>P (Plan)</label>
          <textarea
            rows={4}
            value={p}
            onChange={(e) => setP(e.target.value)}
            placeholder="Treatment plan, medications, follow-up"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

export default SOAPNotes;
