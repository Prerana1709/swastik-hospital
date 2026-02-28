import React, { useState } from "react";

const VITAL_KEYS = [
  { key: "hr", label: "HR (bpm)", highlight: (v) => (Number(v) > 100 ? "alert" : null) },
  { key: "bp", label: "BP (mmHg)", highlight: () => null },
  { key: "sleep", label: "Sleep (hours)", highlight: (v) => (Number(v) < 4 && v !== "" ? "warn" : null) },
  { key: "weight", label: "Weight (kg)", highlight: () => null },
  { key: "agitation", label: "Agitation Score", highlight: () => null },
];

function Vitals({ value = {}, onChange }) {
  const [nursingNote, setNursingNote] = useState("");

  const handleVitalChange = (key, val) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="doctor-vitals">
      <h4 className="doctor-emr-subtitle">Vitals</h4>
      <div className="doctor-vitals-cards">
        {VITAL_KEYS.map(({ key, label, highlight }) => {
          const val = value[key] ?? "";
          const highlightType = highlight(val);
          return (
            <div
              key={key}
              className={`doctor-vital-card ${highlightType ? `doctor-vital-card--${highlightType}` : ""}`}
            >
              <span className="doctor-vital-card__label">{label}</span>
              <input
                type="text"
                className="doctor-vital-card__input"
                value={val}
                onChange={(e) => handleVitalChange(key, e.target.value)}
                placeholder="—"
              />
            </div>
          );
        })}
      </div>
      <div className="doctor-form-group doctor-form-group--full doctor-vitals-nursing">
        <label>Nursing entry</label>
        <textarea
          rows={3}
          value={nursingNote}
          onChange={(e) => setNursingNote(e.target.value)}
          placeholder="Nursing notes, time of recording, etc."
        />
      </div>
    </div>
  );
}

export default Vitals;
