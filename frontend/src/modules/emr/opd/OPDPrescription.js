// OPD e-Prescription: Live state management for dynamic medications.
import React from "react";
import { FaPrescription, FaTrash } from "react-icons/fa";

function OPDPrescription({ prescriptionData, setPrescriptionData }) {
  const medications = prescriptionData.medications || [];

  const updateMedication = (index, field, value) => {
    const next = [...medications];
    next[index] = { ...next[index], [field]: value };
    setPrescriptionData(prev => ({ ...prev, medications: next }));
  };

  const addMedication = () => {
    const next = [...medications, { name: "", dosage: "", frequency: "", duration: "", notes: "" }];
    setPrescriptionData(prev => ({ ...prev, medications: next }));
  };

  const removeMedication = (index) => {
    const next = medications.filter((_, i) => i !== index);
    setPrescriptionData(prev => ({ ...prev, medications: next }));
  };

  return (
    <div className="prescription-section">
      <h3><FaPrescription /> e-Prescription</h3>
      <div className="prescription-form">
        <div className="medication-section">
          <h4>Medications</h4>
          <div className="medication-table">
            <div className="med-row header">
              <div style={{ flex: 2 }}>Medicine</div>
              <div>Dosage</div>
              <div>Freq</div>
              <div>Dur</div>
              <div style={{ width: 40 }}></div>
            </div>
            {medications.map((med, i) => (
              <div key={i} className="med-row">
                <input
                  placeholder="Medicine"
                  value={med.name}
                  onChange={(e) => updateMedication(i, "name", e.target.value)}
                  style={{ flex: 2 }}
                />
                <input
                  placeholder="e.g. 50mg"
                  value={med.dosage}
                  onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                />
                <input
                  placeholder="BD/TDS"
                  value={med.frequency}
                  onChange={(e) => updateMedication(i, "frequency", e.target.value)}
                />
                <input
                  placeholder="7 days"
                  value={med.duration}
                  onChange={(e) => updateMedication(i, "duration", e.target.value)}
                />
                <button type="button" onClick={() => removeMedication(i)} className="remove-med-btn">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="lab-btn lab-btn-secondary" onClick={addMedication} style={{ marginTop: 12 }}>
            + Add Medicine
          </button>
        </div>

        <div className="form-group full-width" style={{ marginTop: 24 }}>
          <label>General Advice / Notes</label>
          <textarea
            value={prescriptionData.notes || ""}
            onChange={(e) => setPrescriptionData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Dietary advice, precautions, etc..."
            rows="3"
          />
        </div>
      </div>
    </div>
  );
}

export default OPDPrescription;
