// IPD Daily Progress Notes form only. Uses Clinical.css classes; no local state.
import { FaClipboardCheck } from "react-icons/fa";

function IPDProgress() {
  return (
    <div className="ipd-progress">
      <h3><FaClipboardCheck /> Daily Progress Notes</h3>
      <div className="progress-container">
        <div className="progress-form">
          <div className="form-group">
            <label>Date & Time</label>
            <input type="datetime-local" />
          </div>
          <div className="form-group">
            <label>Subjective</label>
            <textarea placeholder="Patient's complaints..." rows="3" />
          </div>
          <div className="form-group">
            <label>Objective</label>
            <textarea placeholder="Clinical findings..." rows="3" />
          </div>
          <div className="form-group">
            <label>Assessment</label>
            <textarea placeholder="Clinical assessment..." rows="3" />
          </div>
          <div className="form-group">
            <label>Plan</label>
            <textarea placeholder="Treatment plan..." rows="3" />
          </div>
          <button type="button" className="save-progress-btn">Save Progress Note</button>
        </div>
      </div>
    </div>
  );
}

export default IPDProgress;
