// OPD Consultation form only. Uses Clinical.css classes; no local state.
import { FaNotesMedical } from "react-icons/fa";

function OPDConsultation({
  provisionalDiagnosis = "",
  setProvisionalDiagnosis,
  investigationAdvised = "",
  setInvestigationAdvised,
}) {
  return (
    <div className="opd-consultation">
      <h3><FaNotesMedical /> OPD Consultation</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Chief Complaint *</label>
          <textarea placeholder="Patient's primary complaints..." rows="3" />
        </div>
        <div className="form-group">
          <label>History of Present Illness</label>
          <textarea placeholder="Detailed history..." rows="4" />
        </div>
        <div className="form-group">
          <label>Clinical Examination</label>
          <textarea placeholder="Physical examination findings..." rows="4" />
        </div>
        <div className="form-group">
          <label>Vital Signs</label>
          <div className="vitals-grid">
            <input placeholder="BP (mmHg)" />
            <input placeholder="Pulse (bpm)" />
            <input placeholder="Temp (°C)" />
            <input placeholder="SpO₂ (%)" />
          </div>
        </div>
        <div className="form-group">
          <label>Provisional Diagnosis *</label>
          <input
            placeholder="Enter diagnosis..."
            value={provisionalDiagnosis}
            onChange={(e) => setProvisionalDiagnosis(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Investigation Advised</label>
          <textarea
            placeholder="Lab tests, radiology..."
            rows="3"
            value={investigationAdvised}
            onChange={(e) => setInvestigationAdvised(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default OPDConsultation;
