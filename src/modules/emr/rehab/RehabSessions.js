// Rehab Therapy Sessions table only. Uses Clinical.css classes; no local state.
import { FaCalendarCheck } from "react-icons/fa";

const SESSIONS_DATA = [
  { date: "15-Oct-2024", type: "PT", duration: "45 min", therapist: "Dr. Desai", progress: "Good" },
  { date: "14-Oct-2024", type: "OT", duration: "60 min", therapist: "Dr. Patel", progress: "Excellent" },
  { date: "12-Oct-2024", type: "PT", duration: "45 min", therapist: "Dr. Desai", progress: "Fair" },
];

function RehabSessions() {
  return (
    <div className="rehab-sessions">
      <h3><FaCalendarCheck /> Therapy Sessions</h3>
      <div className="sessions-table">
        <div className="session-row header">
          <div>Date</div>
          <div>Type</div>
          <div>Duration</div>
          <div>Therapist</div>
          <div>Progress</div>
        </div>
        {SESSIONS_DATA.map((session, index) => (
          <div key={index} className="session-row">
            <div>{session.date}</div>
            <div>{session.type}</div>
            <div>{session.duration}</div>
            <div>{session.therapist}</div>
            <div><span className={`progress-status ${session.progress.toLowerCase()}`}>{session.progress}</span></div>
          </div>
        ))}
      </div>
      <button type="button" className="add-session-btn">+ Schedule New Session</button>
    </div>
  );
}

export default RehabSessions;
