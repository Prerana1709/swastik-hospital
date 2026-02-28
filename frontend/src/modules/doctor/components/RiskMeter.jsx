import React from "react";

const AXES = [
  { key: "suicide", label: "Suicide Risk" },
  { key: "violence", label: "Violence Risk" },
  { key: "elopement", label: "Elopement Risk" },
];

const LEVELS = ["Low", "Moderate", "High", "Very High"];
const LEVEL_VALUES = [0, 33, 66, 100];

function RiskMeter({ value = {}, onChange }) {
  const getLevel = (v) => {
    const n = Number(v);
    if (n <= 25) return 0;
    if (n <= 50) return 1;
    if (n <= 75) return 2;
    return 3;
  };

  const handleChange = (key, num) => {
    const next = { ...value, [key]: Math.min(100, Math.max(0, num)) };
    onChange(next);
  };

  return (
    <div className="doctor-risk">
      <h4 className="doctor-emr-subtitle">3-Axis Risk Assessment</h4>
      <div className="doctor-risk-grid">
        {AXES.map(({ key, label }) => {
          const val = value[key] ?? 0;
          const levelIndex = getLevel(val);
          const levelName = LEVELS[levelIndex];
          return (
            <div key={key} className="doctor-risk-axis">
              <label className="doctor-risk-axis__label">{label}</label>
              <div className="doctor-risk-slider-wrap">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={val}
                  onChange={(e) => handleChange(key, Number(e.target.value))}
                  className={`doctor-risk-slider doctor-risk-slider--${levelName.replace(/\s/g, "").toLowerCase()}`}
                />
                <div className="doctor-risk-labels">
                  {LEVELS.map((l, i) => (
                    <span key={l} className={getLevel(val) === i ? "doctor-risk-labels__active" : ""}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <span className={`doctor-risk-value doctor-risk-value--${levelName.replace(/\s/g, "").toLowerCase()}`}>
                {levelName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RiskMeter;
