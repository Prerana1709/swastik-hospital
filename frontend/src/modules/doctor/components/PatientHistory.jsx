import React, { useState } from "react";

const SECTIONS = [
  { key: "psychiatricAdmissions", label: "Psychiatric admissions" },
  { key: "pastDiagnoses", label: "Past diagnoses" },
  { key: "medicationChanges", label: "Medication changes" },
  { key: "familyHistory", label: "Family history" },
  { key: "medicalHistory", label: "Medical history" },
  { key: "substanceUse", label: "Substance use" },
  { key: "forensic", label: "Forensic" },
  { key: "social", label: "Social" },
  { key: "developmental", label: "Developmental history" },
];

const DUMMY_TIMELINE = [
  { id: 1, section: "psychiatricAdmissions", date: "2023-06", text: "First admission – 2 weeks, acute episode." },
  { id: 2, section: "pastDiagnoses", date: "2023-06", text: "Depressive episode (F32.1)." },
  { id: 3, section: "medicationChanges", date: "2023-07", text: "Started escitalopram 10 mg OD." },
  { id: 4, section: "familyHistory", date: "—", text: "Mother: depression. Father: nil significant." },
  { id: 5, section: "medicalHistory", date: "—", text: "Hypertension, controlled. No surgical history." },
];

function PatientHistory({ patientId }) {
  const [items] = useState(DUMMY_TIMELINE);

  return (
    <div className="doctor-history">
      <h4 className="doctor-emr-subtitle">Patient History (Timeline)</h4>
      <div className="doctor-history-timeline">
        {SECTIONS.map((section) => {
          const sectionItems = items.filter((i) => i.section === section.key);
          if (sectionItems.length === 0) {
            return (
              <div key={section.key} className="doctor-history-block">
                <h5 className="doctor-history-block__title">{section.label}</h5>
                <p className="doctor-history-block__empty">No entries.</p>
              </div>
            );
          }
          return (
            <div key={section.key} className="doctor-history-block">
              <h5 className="doctor-history-block__title">{section.label}</h5>
              <ul className="doctor-history-list">
                {sectionItems.map((item) => (
                  <li key={item.id} className="doctor-history-item">
                    <span className="doctor-history-item__date">{item.date}</span>
                    <span className="doctor-history-item__text">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PatientHistory;
