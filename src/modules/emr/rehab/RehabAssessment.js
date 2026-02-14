// Rehab Assessment form only. Uses Clinical.css classes; assessment fields controlled by parent for Evaluate Progress.
import { FaBrain } from "react-icons/fa";

function RehabAssessment({
  rehabInitialAssessment = "",
  setRehabInitialAssessment,
  rehabFunctionalAssessment = "",
  setRehabFunctionalAssessment,
  rehabGoalSetting = "",
  setRehabGoalSetting,
}) {
  return (
    <div className="rehab-assessment">
      <h3><FaBrain /> Rehabilitation Assessment</h3>
      <div className="assessment-grid">
        <div className="assessment-card">
          <h4>Initial Assessment</h4>
          <textarea
            placeholder="Initial evaluation findings..."
            rows="6"
            value={rehabInitialAssessment}
            onChange={(e) => setRehabInitialAssessment(e.target.value)}
          />
        </div>
        <div className="assessment-card">
          <h4>Functional Assessment</h4>
          <textarea
            placeholder="Functional abilities..."
            rows="6"
            value={rehabFunctionalAssessment}
            onChange={(e) => setRehabFunctionalAssessment(e.target.value)}
          />
        </div>
        <div className="assessment-card">
          <h4>Goal Setting</h4>
          <textarea
            placeholder="Rehabilitation goals..."
            rows="6"
            value={rehabGoalSetting}
            onChange={(e) => setRehabGoalSetting(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default RehabAssessment;
