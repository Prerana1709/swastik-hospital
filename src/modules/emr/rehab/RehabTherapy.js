// Rehab Therapy Plan form only. Uses Clinical.css classes; no local state.
import { FaProcedures } from "react-icons/fa";

function RehabTherapy() {
  return (
    <div className="rehab-therapy">
      <h3><FaProcedures /> Therapy Plan</h3>
      <div className="therapy-plan">
        <div className="form-group">
          <label>Therapy Type *</label>
          <select>
            <option>CBT (Cognitive Behavioral Therapy)</option>
            <option>Individual Counseling</option>
            <option>Group Therapy</option>
            <option>Family Therapy</option>
            <option>Supportive Psychotherapy</option>
            <option>Mindfulness-Based</option>
            <option>Psychoeducation</option>
          </select>
        </div>
        <div className="form-group">
          <label>Frequency *</label>
          <select>
            <option>Daily</option>
            <option>3 times/week</option>
            <option>2 times/week</option>
            <option>Weekly</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label>Therapy Plan Details</label>
          <textarea placeholder="Detailed therapy plan..." rows="6" />
        </div>
        <div className="form-group full-width">
          <label>Equipment Needed</label>
          <textarea placeholder="Required equipment..." rows="3" />
        </div>
      </div>
    </div>
  );
}

export default RehabTherapy;
