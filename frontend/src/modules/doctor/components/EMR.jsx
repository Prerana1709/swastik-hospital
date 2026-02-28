import React, { useState } from "react";
import DiagnosisSelector from "./DiagnosisSelector";
import RiskMeter from "./RiskMeter";
import MedicationTable from "./MedicationTable";
import SOAPNotes from "./SOAPNotes";
import Vitals from "./Vitals";
import PatientHistory from "./PatientHistory";

const TABS = [
  { id: "symptoms", label: "Symptoms & MSE" },
  { id: "medication", label: "Medication" },
  { id: "treatment", label: "Treatment Plan" },
  { id: "session", label: "Session Notes" },
  { id: "vitals", label: "Vitals" },
  { id: "history", label: "Patient History" },
];

const MSE_OPTIONS = {
  appearance: ["Well Groomed", "Disheveled", "Guarded", "Agitated"],
  speech: ["Normal", "Pressured", "Slow", "Slurred"],
  mood: ["Euthymic", "Depressed", "Anxious", "Irritable", "Elevated"],
  affect: ["Congruent", "Flat", "Labile", "Restricted"],
  thoughtProcess: ["Logical", "Circumstantial", "Tangential", "Flight of Ideas", "Disorganized"],
  perception: ["No hallucinations", "Auditory hallucinations", "Visual hallucinations", "Delusions"],
  insight: ["Good", "Partial", "Poor"],
  judgment: ["Intact", "Impaired"],
};

const THERAPY_MODALITIES = ["CBT", "DBT", "IPT", "Family Therapy", "Group Therapy"];

const defaultMse = () =>
  Object.keys(MSE_OPTIONS).reduce((acc, key) => ({ ...acc, [key]: [] }), {});

function SymptomsMseTab({ data, onChange }) {
  const handleChip = (category, value) => {
    const current = data.mse?.[category] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...data, mse: { ...(data.mse || defaultMse()), [category]: next } });
  };

  return (
    <div className="doctor-emr-section">
      <div className="doctor-form-grid">
        <div className="doctor-form-group doctor-form-group--full">
          <label>Chief Complaint</label>
          <textarea
            value={data.chiefComplaint || ""}
            onChange={(e) => onChange({ ...data, chiefComplaint: e.target.value })}
            rows={2}
            placeholder="Chief complaint in patient's words"
          />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>HPI</label>
          <textarea
            value={data.hpi || ""}
            onChange={(e) => onChange({ ...data, hpi: e.target.value })}
            rows={3}
            placeholder="History of present illness"
          />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>Past Psychiatric History</label>
          <textarea value={data.pastPsychiatric || ""} onChange={(e) => onChange({ ...data, pastPsychiatric: e.target.value })} rows={2} />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>Medical History</label>
          <textarea value={data.medicalHistory || ""} onChange={(e) => onChange({ ...data, medicalHistory: e.target.value })} rows={2} />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>Substance Use</label>
          <textarea value={data.substanceUse || ""} onChange={(e) => onChange({ ...data, substanceUse: e.target.value })} rows={2} />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>Family History</label>
          <textarea value={data.familyHistory || ""} onChange={(e) => onChange({ ...data, familyHistory: e.target.value })} rows={2} />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>Social History</label>
          <textarea value={data.socialHistory || ""} onChange={(e) => onChange({ ...data, socialHistory: e.target.value })} rows={2} />
        </div>
      </div>
      <h4 className="doctor-emr-subtitle">Mental Status Examination</h4>
      <div className="doctor-mse-grid">
        {Object.entries(MSE_OPTIONS).map(([key, options]) => (
          <div key={key} className="doctor-mse-group">
            <label className="doctor-mse-label">{key.replace(/([A-Z])/g, " $1").trim()}</label>
            <div className="doctor-mse-chips">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`doctor-chip ${(data.mse?.[key] || []).includes(opt) ? "doctor-chip--active" : ""}`}
                  onClick={() => handleChip(key, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <DiagnosisSelector value={data.diagnosis} onChange={(diagnosis) => onChange({ ...data, diagnosis })} />
      <RiskMeter value={data.risk} onChange={(risk) => onChange({ ...data, risk })} />
    </div>
  );
}

function TreatmentPlanTab({ data, onChange }) {
  const toggleModality = (m) => {
    const list = data.therapyModalities || [];
    const next = list.includes(m) ? list.filter((x) => x !== m) : [...list, m];
    onChange({ ...data, therapyModalities: next });
  };

  return (
    <div className="doctor-emr-section">
      <div className="doctor-form-grid">
        <div className="doctor-form-group doctor-form-group--full">
          <label>Short-Term Goals</label>
          <textarea
            value={data.shortTermGoals || ""}
            onChange={(e) => onChange({ ...data, shortTermGoals: e.target.value })}
            rows={3}
          />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>Long-Term Goals</label>
          <textarea
            value={data.longTermGoals || ""}
            onChange={(e) => onChange({ ...data, longTermGoals: e.target.value })}
            rows={3}
          />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>Therapy Modalities</label>
          <div className="doctor-checkbox-group">
            {THERAPY_MODALITIES.map((m) => (
              <label key={m} className="doctor-checkbox">
                <input
                  type="checkbox"
                  checked={(data.therapyModalities || []).includes(m)}
                  onChange={() => toggleModality(m)}
                />
                {m}
              </label>
            ))}
          </div>
        </div>
        <div className="doctor-form-group">
          <label>Allied Health Referrals</label>
          <input
            type="text"
            value={data.alliedReferrals || ""}
            onChange={(e) => onChange({ ...data, alliedReferrals: e.target.value })}
            placeholder="e.g. Psychologist, OT"
          />
        </div>
        <div className="doctor-form-group">
          <label>Discharge Date</label>
          <input
            type="date"
            value={data.dischargeDate || ""}
            onChange={(e) => onChange({ ...data, dischargeDate: e.target.value })}
          />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>Discharge Criteria</label>
          <textarea
            value={data.dischargeCriteria || ""}
            onChange={(e) => onChange({ ...data, dischargeCriteria: e.target.value })}
            rows={2}
          />
        </div>
        <div className="doctor-form-group doctor-form-group--full">
          <label>Safety Plan</label>
          <textarea
            value={data.safetyPlan || ""}
            onChange={(e) => onChange({ ...data, safetyPlan: e.target.value })}
            rows={4}
            placeholder="Crisis contacts, coping strategies, warning signs"
          />
        </div>
      </div>
    </div>
  );
}

function EMR({ patientId, patientName }) {
  const [activeTab, setActiveTab] = useState("symptoms");
  const [emrData, setEmrData] = useState({
    mse: defaultMse(),
    diagnosis: {},
    risk: {},
    medications: [],
    soap: {},
    vitals: {},
  });

  return (
    <div className="doctor-emr">
      <div className="doctor-emr-header">
        <h2 className="doctor-page-title">EMR – {patientName || "Patient"}</h2>
        {patientId && <span className="doctor-emr-uhid">UHID: {patientId}</span>}
      </div>
      <div className="doctor-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`doctor-tab ${activeTab === tab.id ? "doctor-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="doctor-tab-panel">
        {activeTab === "symptoms" && (
          <SymptomsMseTab data={emrData} onChange={setEmrData} />
        )}
        {activeTab === "medication" && (
          <MedicationTable
            value={emrData.medications}
            onChange={(medications) => setEmrData((d) => ({ ...d, medications }))}
          />
        )}
        {activeTab === "treatment" && (
          <TreatmentPlanTab data={emrData} onChange={setEmrData} />
        )}
        {activeTab === "session" && (
          <SOAPNotes value={emrData.soap} onChange={(soap) => setEmrData((d) => ({ ...d, soap }))} />
        )}
        {activeTab === "vitals" && (
          <Vitals value={emrData.vitals} onChange={(vitals) => setEmrData((d) => ({ ...d, vitals }))} />
        )}
        {activeTab === "history" && <PatientHistory patientId={patientId} />}
      </div>
    </div>
  );
}

export default EMR;
