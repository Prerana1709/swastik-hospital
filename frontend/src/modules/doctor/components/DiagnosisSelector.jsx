import React, { useState, useMemo } from "react";
import icd11Data from "../../../data/icd11_psychiatric.json";
import dsm5Data from "../../../data/dsm5_psychiatric.json";

const SEVERITY_OPTIONS = ["Mild", "Moderate", "Severe", "In remission", "Unspecified"];
const SPECIFIER_OPTIONS = ["Single episode", "Recurrent", "With psychotic features", "With anxious distress", "Seasonal pattern", "Peripartum onset", "Unspecified"];

function DiagnosisSelector({ value = {}, onChange }) {
  const [system, setSystem] = useState(value.system || "icd11");
  const [search, setSearch] = useState("");
  const [primarySearch, setPrimarySearch] = useState("");
  const [secondarySearch, setSecondarySearch] = useState("");
  const [showSecondary, setShowSecondary] = useState(false);

  const dataset = system === "icd11" ? icd11Data : dsm5Data;
  const codeKey = system === "icd11" ? "code" : "code";

  const filteredPrimary = useMemo(() => {
    if (!primarySearch.trim()) return dataset.slice(0, 10);
    const q = primarySearch.toLowerCase();
    return dataset.filter(
      (d) =>
        (d.code || "").toLowerCase().includes(q) ||
        (d.title || "").toLowerCase().includes(q)
    );
  }, [dataset, primarySearch]);

  const filteredSecondary = useMemo(() => {
    if (!secondarySearch.trim()) return dataset.slice(0, 10);
    const q = secondarySearch.toLowerCase();
    return dataset.filter(
      (d) =>
        (d.code || "").toLowerCase().includes(q) ||
        (d.title || "").toLowerCase().includes(q)
    );
  }, [dataset, secondarySearch]);

  const primary = value.primary || null;
  const secondaryList = value.secondary || [];
  const severity = value.severity || "";
  const specifier = value.specifier || "";

  return (
    <div className="doctor-diagnosis">
      <h4 className="doctor-emr-subtitle">Diagnosis</h4>
      <div className="doctor-diagnosis-toggle">
        <button
          type="button"
          className={`doctor-toggle-btn ${system === "icd11" ? "doctor-toggle-btn--active" : ""}`}
          onClick={() => setSystem("icd11")}
        >
          ICD-11
        </button>
        <button
          type="button"
          className={`doctor-toggle-btn ${system === "dsm5" ? "doctor-toggle-btn--active" : ""}`}
          onClick={() => setSystem("dsm5")}
        >
          DSM-5
        </button>
      </div>
      <input
        type="text"
        className="doctor-diagnosis-search"
        placeholder="Search by code or title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="doctor-form-group">
        <label>Primary diagnosis</label>
        <input
          type="text"
          placeholder="Search and select primary..."
          value={primarySearch}
          onChange={(e) => setPrimarySearch(e.target.value)}
          onFocus={() => setPrimarySearch(primarySearch || (primary ? `${primary.code} ${primary.title}` : ""))}
        />
        {primarySearch && filteredPrimary.length > 0 && (
          <ul className="doctor-diagnosis-list">
            {filteredPrimary.slice(0, 8).map((d) => (
              <li key={d.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange({ ...value, system, primary: d });
                    setPrimarySearch("");
                  }}
                >
                  [{d.code}] {d.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {primary && (
        <div className="doctor-diagnosis-badge doctor-diagnosis-badge--primary">
          [{primary.code}] {primary.title}
          {severity && ` (${severity})`}
        </div>
      )}

      <div className="doctor-form-row-inline">
        <div className="doctor-form-group">
          <label>Severity</label>
          <select
            value={severity}
            onChange={(e) => onChange({ ...value, severity: e.target.value })}
          >
            <option value="">Select</option>
            {SEVERITY_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="doctor-form-group">
          <label>Specifier</label>
          <select
            value={specifier}
            onChange={(e) => onChange({ ...value, specifier: e.target.value })}
          >
            <option value="">Select</option>
            {SPECIFIER_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="doctor-form-group">
        <label>
          <input
            type="checkbox"
            checked={showSecondary}
            onChange={(e) => setShowSecondary(e.target.checked)}
          />
          {" "}Add secondary diagnosis
        </label>
      </div>

      {showSecondary && (
        <>
          <input
            type="text"
            placeholder="Search secondary..."
            value={secondarySearch}
            onChange={(e) => setSecondarySearch(e.target.value)}
          />
          {secondarySearch && filteredSecondary.length > 0 && (
            <ul className="doctor-diagnosis-list">
              {filteredSecondary.slice(0, 8).map((d) => (
                <li key={d.code}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!secondaryList.some((s) => s.code === d.code)) {
                        onChange({ ...value, secondary: [...secondaryList, d] });
                        setSecondarySearch("");
                      }
                    }}
                  >
                    [{d.code}] {d.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {secondaryList.map((d) => (
            <div key={d.code} className="doctor-diagnosis-badge doctor-diagnosis-badge--secondary">
              [{d.code}] {d.title}
              <button
                type="button"
                className="doctor-diagnosis-remove"
                onClick={() => onChange({ ...value, secondary: secondaryList.filter((s) => s.code !== d.code) })}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default DiagnosisSelector;
