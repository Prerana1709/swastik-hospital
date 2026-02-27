import OPDConsultation from "./OPDConsultation";
import OPDPrescription from "./OPDPrescription";
import OPDLabOrders from "./OPDLabOrders";
import OPDHistory from "./OPDHistory";

function OPDContainer({
  activeSection,
  consultationData,
  setConsultationData,
  prescriptionData,
  setPrescriptionData,
  patientData,
}) {
  if (activeSection === "consultation")
    return (
      <OPDConsultation
        consultationData={consultationData}
        setConsultationData={setConsultationData}
      />
    );
  if (activeSection === "prescription")
    return (
      <OPDPrescription
        prescriptionData={prescriptionData}
        setPrescriptionData={setPrescriptionData}
      />
    );
  if (activeSection === "orders")
    return <OPDLabOrders patientData={patientData} />;

  if (activeSection === "history")
    return <OPDHistory patientData={patientData} />;

  return null;
}

export default OPDContainer;
