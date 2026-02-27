// Rehab workspace: Assessment, Therapy Plan, Sessions, Progress & Relapse.
import RehabAssessment from "./RehabAssessment";
import RehabTherapy from "./RehabTherapy";
import RehabSessions from "./RehabSessions";
import RehabProgress from "./RehabProgress";

function RehabContainer({ activeSection, rehabData, setRehabData, onSave }) {
  if (activeSection === "assessment")
    return (
      <RehabAssessment
        rehabData={rehabData}
        setRehabData={setRehabData}
        onSave={() => onSave("Assessment")}
      />
    );
  if (activeSection === "therapy")
    return (
      <RehabTherapy
        rehabData={rehabData}
        setRehabData={setRehabData}
        onSave={() => onSave("TherapyPlan")}
      />
    );
  if (activeSection === "sessions")
    return (
      <RehabSessions
        rehabData={rehabData}
        setRehabData={setRehabData}
        onSave={() => onSave("Sessions")}
      />
    );
  if (activeSection === "progress")
    return (
      <RehabProgress
        rehabData={rehabData}
        setRehabData={setRehabData}
        onSave={() => onSave("ProgressLog")}
      />
    );
  return null;
}

export default RehabContainer;
