// IPD Admission form only. Uses Clinical.css classes; ward/bed controlled by parent for Transfer Ward.
import { FaRegHospital } from "react-icons/fa";

function IPDAdmission({
  ipdWard = "General Ward",
  setIpdWard,
  ipdBedNumber = "",
  setIpdBedNumber,
}) {
  return (
    <div className="ipd-admission">
      <h3><FaRegHospital /> IPD Admission</h3>
      <div className="ipd-form-grid">
        <div className="form-group">
          <label>Admission Date *</label>
          <input type="date" />
        </div>
        <div className="form-group">
          <label>Select Ward *</label>
          <select value={ipdWard} onChange={(e) => setIpdWard(e.target.value)}>
            <option>General Ward</option>
            <option>ICU</option>
            <option>Private Room</option>
            <option>Semi-Private</option>
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
            <option>Dr. Sharma</option>
            <option>Dr. Mehta</option>
            <option>Dr. Desai</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label>Admission Diagnosis *</label>
          <textarea placeholder="Primary diagnosis for admission..." rows="3" />
        </div>
        <div className="form-group full-width">
          <label>Admission Notes</label>
          <textarea placeholder="Additional admission notes..." rows="4" />
        </div>
      </div>
    </div>
  );
}

export default IPDAdmission;
