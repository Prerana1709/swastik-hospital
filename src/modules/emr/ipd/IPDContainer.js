// IPD workspace content: renders Admission or Progress by activeSection.
import IPDAdmission from "./IPDAdmission";
import IPDProgress from "./IPDProgress";

function IPDContainer({
  activeSection,
  ipdWard,
  setIpdWard,
  ipdBedNumber,
  setIpdBedNumber,
}) {
  if (activeSection === "admission")
    return (
      <IPDAdmission
        ipdWard={ipdWard}
        setIpdWard={setIpdWard}
        ipdBedNumber={ipdBedNumber}
        setIpdBedNumber={setIpdBedNumber}
      />
    );
  if (activeSection === "progress") return <IPDProgress />;
  return null;
}

export default IPDContainer;
