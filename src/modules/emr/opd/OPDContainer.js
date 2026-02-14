// OPD workspace content: renders Consultation or Prescription by activeSection.
import OPDConsultation from "./OPDConsultation";
import OPDPrescription from "./OPDPrescription";

function OPDContainer({
  activeSection,
  provisionalDiagnosis,
  setProvisionalDiagnosis,
  investigationAdvised,
  setInvestigationAdvised,
}) {
  if (activeSection === "consultation")
    return (
      <OPDConsultation
        provisionalDiagnosis={provisionalDiagnosis}
        setProvisionalDiagnosis={setProvisionalDiagnosis}
        investigationAdvised={investigationAdvised}
        setInvestigationAdvised={setInvestigationAdvised}
      />
    );
  if (activeSection === "prescription") return <OPDPrescription />;
  return null;
}

export default OPDContainer;
