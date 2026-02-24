// Rehab workspace: Assessment, Therapy Plan, Sessions, Progress & Relapse.
import RehabAssessment from "./RehabAssessment";
import RehabTherapy from "./RehabTherapy";
import RehabSessions from "./RehabSessions";
import RehabProgress from "./RehabProgress";

function RehabContainer({
  activeSection,
  rehabInitialAssessment,
  setRehabInitialAssessment,
  rehabFunctionalAssessment,
  setRehabFunctionalAssessment,
  rehabGoalSetting,
  setRehabGoalSetting,
}) {
  if (activeSection === "assessment")
    return (
      <RehabAssessment
        rehabInitialAssessment={rehabInitialAssessment}
        setRehabInitialAssessment={setRehabInitialAssessment}
        rehabFunctionalAssessment={rehabFunctionalAssessment}
        setRehabFunctionalAssessment={setRehabFunctionalAssessment}
        rehabGoalSetting={rehabGoalSetting}
        setRehabGoalSetting={setRehabGoalSetting}
      />
    );
  if (activeSection === "therapy") return <RehabTherapy />;
  if (activeSection === "sessions") return <RehabSessions />;
  if (activeSection === "progress") return <RehabProgress />;
  return null;
}

export default RehabContainer;
