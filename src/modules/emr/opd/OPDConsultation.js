// Psychiatric OPD Consultation: collapsible sections, MSE, PHQ-9/GAD-7 scoring, diagnosis & treatment plan.
import React, { useState, useMemo } from "react";
import { FaNotesMedical, FaChevronDown, FaChevronRight } from "react-icons/fa";

const PHQ9_ITEMS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure",
  "Trouble concentrating on things",
  "Moving or speaking slowly or restlessness",
  "Thoughts that you would be better off dead or hurting yourself",
];

const GAD7_ITEMS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

function getPhq9Severity(total) {
  if (total <= 4) return { label: "Minimal", class: "minimal" };
  if (total <= 9) return { label: "Mild", class: "mild" };
  if (total <= 14) return { label: "Moderate", class: "moderate" };
  if (total <= 19) return { label: "Moderately Severe", class: "mod-severe" };
  return { label: "Severe", class: "severe" };
}

function getGad7Severity(total) {
  if (total <= 4) return { label: "Minimal", class: "minimal" };
  if (total <= 9) return { label: "Mild", class: "mild" };
  if (total <= 14) return { label: "Moderate", class: "moderate" };
  return { label: "Severe", class: "severe" };
}

function CollapsibleSection({ id, title, open, onToggle, children }) {
  return (
    <div className={`psych-section ${open ? "open" : "collapsed"}`}>
      <button
        type="button"
        className="psych-section-header"
        onClick={() => onToggle(id)}
        aria-expanded={open}
      >
        <span className="psych-section-icon">{open ? <FaChevronDown /> : <FaChevronRight />}</span>
        <span>{title}</span>
      </button>
      {open && <div className="psych-section-body">{children}</div>}
    </div>
  );
}

function OPDConsultation({
  provisionalDiagnosis = "",
  setProvisionalDiagnosis,
  investigationAdvised = "",
  setInvestigationAdvised,
}) {
  const [openSections, setOpenSections] = useState({
    history: true,
    mse: true,
    scales: true,
    diagnosis: true,
  });
  const [phq9, setPhq9] = useState(Array(9).fill(0));
  const [gad7, setGad7] = useState(Array(7).fill(0));
  const [suicideRisk, setSuicideRisk] = useState("Low");

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const phq9Total = useMemo(() => phq9.reduce((a, b) => a + b, 0), [phq9]);
  const gad7Total = useMemo(() => gad7.reduce((a, b) => a + b, 0), [gad7]);
  const phq9Severity = useMemo(() => getPhq9Severity(phq9Total), [phq9Total]);
  const gad7Severity = useMemo(() => getGad7Severity(gad7Total), [gad7Total]);

  const setPhq9Item = (index, value) => {
    const v = Math.max(0, Math.min(3, parseInt(value, 10) || 0));
    setPhq9((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };
  const setGad7Item = (index, value) => {
    const v = Math.max(0, Math.min(3, parseInt(value, 10) || 0));
    setGad7((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  return (
    <div className="opd-consultation psych-consultation">
      <h3><FaNotesMedical /> Psychiatric Consultation</h3>

      {/* 1. History & Presentation */}
      <CollapsibleSection
        id="history"
        title="1. Chief Complaint & History"
        open={openSections.history}
        onToggle={toggleSection}
      >
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Chief Psychological Complaint *</label>
            <textarea placeholder="Primary psychological/emotional complaints..." rows="3" />
          </div>
          <div className="form-group">
            <label>Duration of Symptoms</label>
            <input placeholder="e.g. 6 months, 2 years" />
          </div>
          <div className="form-group">
            <label>Sleep Pattern</label>
            <textarea placeholder="Duration, quality, nightmares, early waking..." rows="2" />
          </div>
          <div className="form-group">
            <label>Appetite Changes</label>
            <textarea placeholder="Increase/decrease, weight change..." rows="2" />
          </div>
          <div className="form-group full-width">
            <label>Substance Use History</label>
            <textarea placeholder="Alcohol, tobacco, drugs, duration, last use..." rows="3" />
          </div>
          <div className="form-group full-width">
            <label>Past Psychiatric History</label>
            <textarea placeholder="Previous diagnoses, admissions, treatments, medications..." rows="3" />
          </div>
          <div className="form-group full-width">
            <label>Family Psychiatric History</label>
            <textarea placeholder="Family history of mental illness, suicide, substance use..." rows="3" />
          </div>
          <div className="form-group full-width">
            <label>Social & Occupational Background</label>
            <textarea placeholder="Living situation, occupation, support, stressors..." rows="3" />
          </div>
        </div>
      </CollapsibleSection>

      {/* 2. Mental Status Examination */}
      <CollapsibleSection
        id="mse"
        title="2. Mental Status Examination (MSE)"
        open={openSections.mse}
        onToggle={toggleSection}
      >
        <div className="form-grid mse-grid">
          {["Appearance", "Behavior", "Speech", "Mood", "Affect", "Thought Process", "Thought Content", "Insight", "Judgment"].map((field) => (
            <div key={field} className="form-group">
              <label>{field}</label>
              <textarea placeholder={`${field}...`} rows="2" />
            </div>
          ))}
          <div className="form-group full-width">
            <label>Perception (Hallucinations / Delusions)</label>
            <textarea placeholder="Describe any hallucinations, delusions, or perceptual disturbances..." rows="3" />
          </div>
        </div>
      </CollapsibleSection>

      {/* 3. Psychiatric Scale Scoring */}
      <CollapsibleSection
        id="scales"
        title="3. Psychiatric Scale Scoring"
        open={openSections.scales}
        onToggle={toggleSection}
      >
        <div className="scales-block">
          <div className="scale-card">
            <h4>PHQ-9 (Depression)</h4>
            <p className="scale-hint">0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day</p>
            <div className="scale-items">
              {PHQ9_ITEMS.map((item, i) => (
                <div key={i} className="scale-row">
                  <label>{item}</label>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={phq9[i]}
                    onChange={(e) => setPhq9Item(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="scale-summary">
              <strong>Total: {phq9Total}</strong> (0–27) — <span className={`severity-badge ${phq9Severity.class}`}>{phq9Severity.label}</span>
            </div>
          </div>
          <div className="scale-card">
            <h4>GAD-7 (Anxiety)</h4>
            <p className="scale-hint">0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day</p>
            <div className="scale-items">
              {GAD7_ITEMS.map((item, i) => (
                <div key={i} className="scale-row">
                  <label>{item}</label>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={gad7[i]}
                    onChange={(e) => setGad7Item(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="scale-summary">
              <strong>Total: {gad7Total}</strong> (0–21) — <span className={`severity-badge ${gad7Severity.class}`}>{gad7Severity.label}</span>
            </div>
          </div>
          <div className="form-group">
            <label>Suicide Risk Level</label>
            <select value={suicideRisk} onChange={(e) => setSuicideRisk(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* 4. Diagnosis & Treatment Plan */}
      <CollapsibleSection
        id="diagnosis"
        title="4. Diagnosis & Treatment Plan"
        open={openSections.diagnosis}
        onToggle={toggleSection}
      >
        <div className="form-grid">
          <div className="form-group full-width">
            <label>DSM-5 Diagnosis *</label>
            <input
              placeholder="e.g. Major Depressive Disorder, Single Episode, Severe"
              value={provisionalDiagnosis}
              onChange={(e) => setProvisionalDiagnosis(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>ICD-10 Code</label>
            <input placeholder="e.g. F32.2" />
          </div>
          <div className="form-group">
            <label>Follow-up Date</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Admission Required</label>
            <select>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Medication Plan</label>
            <textarea placeholder="Medications, doses, duration..." rows="4" />
          </div>
          <div className="form-group full-width">
            <label>Therapy Plan (CBT / Counseling / Rehab)</label>
            <textarea placeholder="Type, frequency, focus areas..." rows="3" />
          </div>
          <div className="form-group full-width">
            <label>Investigation Advised</label>
            <textarea
              placeholder="Thyroid, B12, drug screen, EEG..."
              rows="2"
              value={investigationAdvised}
              onChange={(e) => setInvestigationAdvised(e.target.value)}
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default OPDConsultation;
