// Psychiatric IPD Admission. Ward/bed controlled by parent for Transfer Ward.
import { FaRegHospital } from "react-icons/fa";

function IPDAdmission({
  ipdWard = "Psychiatric Ward-A",
  setIpdWard,
  ipdBedNumber = "",
  setIpdBedNumber,
}) {
  return (
    <div className="ipd-admission">
      <h3><FaRegHospital /> Psychiatric IPD Admission</h3>
      <div className="ipd-form-grid">
        <div className="form-group">
          <label>Admission Date *</label>
          <input type="date" />
        </div>
        <div className="form-group">
          <label>Select Ward *</label>
          <select value={ipdWard} onChange={(e) => setIpdWard(e.target.value)}>
            <option>Psychiatric Ward-A</option>
            <option>Psychiatric Ward-B</option>
            <option>Crisis Stabilization Unit</option>
            <option>Detox / Substance Use Ward</option>
            <option>Private Room</option>
          </select>
        </div>
        <div className="form-group">
          <label>Bed Number *</label>
          <input
            placeholder="Bed number"
            value={ipdBedNumber}
            onChange={(e) => setIpdBedNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Admitting Doctor *</label>
          <select>
            <option>Dr. P. M. Chougule</option>
            <option>Dr. Nikhil Chougule</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label>Admission Diagnosis (DSM-5 / ICD-10) *</label>
          <textarea placeholder="e.g. Major Depressive Disorder, Severe with suicidal ideation (F32.2)..." rows="3" />
        </div>
        <div className="form-group full-width">
          <label>Reason for Admission & Risk Assessment</label>
          <textarea placeholder="Clinical justification, risk level, safety concerns..." rows="4" />
        </div>
      </div>
    </div>
  );
}

export default IPDAdmission;
