// IPD workspace content: renders Admission or Progress by activeSection.
import IPDAdmission from "./IPDAdmission";
import IPDProgress from "./IPDProgress";

function IPDContainer({
  activeSection,
  admissionData,
  setAdmissionData,
  progressData,
  setProgressData,
  onSaveAdmission,
  onSaveProgress
}) {
  if (activeSection === "admission")
    return (
      <IPDAdmission
        admissionData={admissionData}
        setAdmissionData={setAdmissionData}
        onSave={onSaveAdmission}
      />
    );
  if (activeSection === "progress")
    return (
      <IPDProgress
        progressData={progressData}
        setProgressData={setProgressData}
        onSave={onSaveProgress}
      />
    );
  return null;
}

export default IPDContainer;
