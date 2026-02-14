// OPD e-Prescription form only. Uses Clinical.css classes; no local state.
import { FaPrescription } from "react-icons/fa";

function OPDPrescription() {
  return (
    <div className="prescription-section">
      <h3><FaPrescription /> e-Prescription</h3>
      <div className="prescription-form">
        <div className="medication-section">
          <h4>Medications</h4>
          <div className="medication-table">
            <div className="med-row header">
              <div>Medicine</div>
              <div>Dosage</div>
              <div>Frequency</div>
              <div>Duration</div>
            </div>
            <div className="med-row">
              <input placeholder="Medicine name" />
              <input placeholder="e.g., 500mg" />
              <input placeholder="e.g., BD" />
              <input placeholder="e.g., 7 days" />
            </div>
          </div>
          <button type="button" className="add-med-btn">+ Add Medicine</button>
        </div>
      </div>
    </div>
  );
}

export default OPDPrescription;
