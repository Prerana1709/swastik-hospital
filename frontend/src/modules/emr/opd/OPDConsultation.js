// Psychiatric OPD Consultation: Live state management, MSE, PHQ-9/GAD-7 scoring.
import React, { useState, useMemo, useEffect } from "react";
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

const HAMD_ITEMS = [
  "Depressed Mood (Sadness, hopeless, helpless, worthless)",
  "Feelings of Guilt",
  "Suicide (Ideas, gestures, attempts)",
  "Insomnia Early (Difficulty falling asleep)",
  "Insomnia Middle (Waking during the night)",
  "Insomnia Late (Waking in early hours)",
  "Work and Activities",
  "Retardation: Psychomotor (Slowness of thought and speech; impaired ability to concentrate; decreased motor activity)",
  "Agitation",
  "Anxiety (Psychic)",
  "Anxiety (Somatic)",
  "Somatic Symptoms (Gastrointestinal)",
  "Somatic Symptoms (General)",
  "Genital Symptoms",
  "Hypochondriasis",
  "Loss of Weight",
  "Insight"
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

function getHamdSeverity(total) {
  if (total <= 7) return { label: "Normal", class: "minimal" };
  if (total <= 13) return { label: "Mild Depression", class: "mild" };
  if (total <= 18) return { label: "Moderate Depression", class: "moderate" };
  if (total <= 22) return { label: "Severe Depression", class: "mod-severe" };
  return { label: "Very Severe Depression", class: "severe" };
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
  consultationData,
  setConsultationData
}) {
  const [openSections, setOpenSections] = useState({
    history: true,
    mse: true,
    scales: true,
    diagnosis: true,
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateField = (field, value) => {
    setConsultationData(prev => ({ ...prev, [field]: value }));
  };

  const updateMSE = (field, value) => {
    setConsultationData(prev => ({
      ...prev,
      mse: { ...prev.mse, [field]: value }
    }));
  };

  const phq9 = consultationData.phq9 || Array(9).fill(0);
  const gad7 = consultationData.gad7 || Array(7).fill(0);

  const phq9Total = useMemo(() => phq9.reduce((a, b) => a + b, 0), [phq9]);
  const gad7Total = useMemo(() => gad7.reduce((a, b) => a + b, 0), [gad7]);
  const phq9Severity = useMemo(() => getPhq9Severity(phq9Total), [phq9Total]);
  const gad7Severity = useMemo(() => getGad7Severity(gad7Total), [gad7Total]);

  const setPhq9Item = (index, value) => {
    const v = Math.max(0, Math.min(3, parseInt(value, 10) || 0));
    const next = [...phq9];
    next[index] = v;
    updateField("phq9", next);
  };

  const setGad7Item = (index, value) => {
    const v = Math.max(0, Math.min(3, parseInt(value, 10) || 0));
    const next = [...gad7];
    next[index] = v;
    updateField("gad7", next);
  };

  return (
    <div className="opd-consultation psych-consultation">
      <h3><FaNotesMedical /> Psychiatric Consultation</h3>

      <CollapsibleSection
        id="history"
        title="1. Chief Complaint & History"
        open={openSections.history}
        onToggle={toggleSection}
      >
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Chief Psychological Complaint *</label>
            <textarea
              value={consultationData.chiefComplaint || ""}
              onChange={(e) => updateField("chiefComplaint", e.target.value)}
              placeholder="Primary psychological/emotional complaints..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Duration of Symptoms</label>
            <input
              value={consultationData.duration || ""}
              onChange={(e) => updateField("duration", e.target.value)}
              placeholder="e.g. 6 months, 2 years"
            />
          </div>
          <div className="form-group">
            <label>Sleep Pattern</label>
            <textarea
              value={consultationData.sleepPattern || ""}
              onChange={(e) => updateField("sleepPattern", e.target.value)}
              placeholder="Duration, quality, nightmares, early waking..."
              rows="2"
            />
          </div>
          <div className="form-group">
            <label>Appetite Changes</label>
            <textarea
              value={consultationData.appetite || ""}
              onChange={(e) => updateField("appetite", e.target.value)}
              placeholder="Increase/decrease, weight change..."
              rows="2"
            />
          </div>
          <div className="form-group full-width">
            <label>Past Psychiatric History</label>
            <textarea
              value={consultationData.pastHistory || ""}
              onChange={(e) => updateField("pastHistory", e.target.value)}
              placeholder="Previous diagnoses, admissions, treatments..."
              rows="3"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="mse"
        title="2. Mental Status Examination (MSE)"
        open={openSections.mse}
        onToggle={toggleSection}
      >
        <div className="form-grid mse-grid">
          {["Appearance", "Behavior", "Speech", "Mood", "Affect", "ThoughtProcess", "ThoughtContent", "Insight", "Judgment"].map((field) => (
            <div key={field} className="form-group">
              <label>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
              <textarea
                value={consultationData.mse?.[field] || ""}
                onChange={(e) => updateMSE(field, e.target.value)}
                placeholder={`${field}...`}
                rows="2"
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="scales"
        title="3. Psychiatric Scale Scoring"
        open={openSections.scales}
        onToggle={toggleSection}
      >
        <div className="scales-block">
          {/* PHQ-9 */}
          <div className="scale-card">
            <h4>PHQ-9 (Depression)</h4>
            <div className="scale-items">
              {PHQ9_ITEMS.map((item, i) => (
                <div key={i} className="scale-row-alt">
                  <label>{item}</label>
                  <div className="score-options">
                    {[0, 1, 2, 3].map(v => (
                      <button
                        key={v}
                        type="button"
                        className={`score-btn ${phq9[i] === v ? 'active' : ''}`}
                        onClick={() => setPhq9Item(i, v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="scale-summary">
              <strong>Total Score: {phq9Total}</strong> — <span className={`severity-badge ${phq9Severity.class}`}>{phq9Severity.label}</span>
            </div>
          </div>

          {/* GAD-7 */}
          <div className="scale-card">
            <h4>GAD-7 (Anxiety)</h4>
            <div className="scale-items">
              {GAD7_ITEMS.map((item, i) => (
                <div key={i} className="scale-row-alt">
                  <label>{item}</label>
                  <div className="score-options">
                    {[0, 1, 2, 3].map(v => (
                      <button
                        key={v}
                        type="button"
                        className={`score-btn ${gad7[i] === v ? 'active' : ''}`}
                        onClick={() => setGad7Item(i, v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="scale-summary">
              <strong>Total Score: {gad7Total}</strong> — <span className={`severity-badge ${gad7Severity.class}`}>{gad7Severity.label}</span>
            </div>
          </div>

          {/* HAM-D */}
          <div className="scale-card full-width">
            <h4>HAM-D (Hamilton Depression Rating Scale)</h4>
            <div className="scale-items grid-2">
              {(consultationData.hamd || Array(17).fill(0)).map((val, i) => (
                <div key={i} className="scale-row-alt">
                  <label>{HAMD_ITEMS[i]}</label>
                  <div className="score-options">
                    {[0, 1, 2, 3, 4].map(v => (
                      <button
                        key={v}
                        type="button"
                        className={`score-btn ${val === v ? 'active' : ''}`}
                        onClick={() => {
                          const next = [...(consultationData.hamd || Array(17).fill(0))];
                          next[i] = v;
                          updateField("hamd", next);
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="scale-summary">
              {(() => {
                const total = (consultationData.hamd || Array(17).fill(0)).reduce((a, b) => a + b, 0);
                const sev = getHamdSeverity(total);
                return (
                  <>
                    <strong>Total Score: {total}</strong> — <span className={`severity-badge ${sev.class}`}>{sev.label}</span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </CollapsibleSection>

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
              placeholder="e.g. Major Depressive Disorder"
              value={consultationData.diagnosis || ""}
              onChange={(e) => updateField("diagnosis", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Follow-up Date</label>
            <input
              type="date"
              value={consultationData.followUpDate || ""}
              onChange={(e) => updateField("followUpDate", e.target.value)}
            />
          </div>
          <div className="form-group full-width">
            <label>Investigation Advised</label>
            <textarea
              placeholder="Thyroid, B12, drug screen..."
              rows="2"
              value={consultationData.investigationAdvised || ""}
              onChange={(e) => updateField("investigationAdvised", e.target.value)}
            />
          </div>
          <div className="form-group full-width">
            <label>Therapy Plan</label>
            <textarea
              value={consultationData.therapyPlan || ""}
              onChange={(e) => updateField("therapyPlan", e.target.value)}
              placeholder="CBT / Counseling focus..."
              rows="3"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default OPDConsultation;
