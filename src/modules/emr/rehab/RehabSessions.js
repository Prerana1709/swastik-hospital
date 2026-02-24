// Rehab: Therapy sessions with Session Outcome Score. Psychiatric focus.
import { FaCalendarCheck } from "react-icons/fa";

const SESSIONS_DATA = [
  { date: "15-Oct-2024", type: "CBT", duration: "50 min", therapist: "Dr. P. M. Chougule", outcomeScore: 8, progress: "Good" },
  { date: "14-Oct-2024", type: "Counseling", duration: "45 min", therapist: "Dr. Nikhil Chougule", outcomeScore: 9, progress: "Excellent" },
  { date: "12-Oct-2024", type: "CBT", duration: "50 min", therapist: "Dr. P. M. Chougule", outcomeScore: 5, progress: "Fair" },
];

function RehabSessions() {
  return (
    <div className="rehab-sessions">
      <h3><FaCalendarCheck /> Therapy Sessions</h3>
      <p className="rehab-section-hint">Session outcome score: 1–10 (10 = best).</p>
      <div className="sessions-table">
        <div className="session-row header">
          <div>Date</div>
          <div>Type</div>
          <div>Duration</div>
          <div>Therapist</div>
          <div>Outcome Score</div>
          <div>Progress</div>
        </div>
        {SESSIONS_DATA.map((session, index) => (
          <div key={index} className="session-row">
            <div>{session.date}</div>
            <div>{session.type}</div>
            <div>{session.duration}</div>
            <div>{session.therapist}</div>
            <div><span className="outcome-score">{session.outcomeScore}/10</span></div>
            <div><span className={`progress-status ${session.progress.toLowerCase()}`}>{session.progress}</span></div>
          </div>
        ))}
      </div>
      <button type="button" className="add-session-btn">+ Schedule New Session</button>
    </div>
  );
}

export default RehabSessions;
