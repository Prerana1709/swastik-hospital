import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaSearch, FaFilter, FaUserMd, FaStethoscope, 
  FaPrescription, FaFileMedicalAlt, FaBed, FaFilePdf, FaPrint, 
  FaSave, FaCalendar, FaHistory, FaChartLine, FaHeartbeat, 
  FaProcedures, FaBrain, FaWalking, FaNotesMedical, FaClipboardCheck,
  FaFileInvoiceDollar, FaCalendarCheck, FaUserInjured, FaRegHospital
} from "react-icons/fa";
// EMR module: Clinical controller. State and layout here; OPD/IPD/Rehab in sub-modules.
import "./Clinical.css";
import swastikLogo from "../../assets/swastiklogo.png";

import OPDContainer from "./opd/OPDContainer";
import IPDContainer from "./ipd/IPDContainer";
import RehabContainer from "./rehab/RehabContainer";

// Initial patient data; kept outside component for useState initial value.
const initialPatients = {
  opd: [
    { id: 1, token: 101, name: "Ramesh Patil", age: 45, gender: "Male", uhid: "UHID-2024-001", status: "Waiting", doctor: "Dr. Sharma", department: "Cardiology", time: "10:30 AM", priority: "High", lastVisit: "12-Sep-2024", allergies: ["Penicillin", "Aspirin"] },
    { id: 2, token: 102, name: "Sunita Kulkarni", age: 32, gender: "Female", uhid: "UHID-2024-002", status: "In Consultation", doctor: "Dr. Sharma", department: "Orthopedics", time: "10:45 AM", priority: "Normal", lastVisit: "15-Aug-2024", allergies: ["None"] },
  ],
  ipd: [
    { id: 3, name: "Amit Joshi", age: 55, gender: "Male", uhid: "UHID-2024-003", status: "Admitted", doctor: "Dr. Mehta", department: "General Medicine", ward: "Ward-301", bed: "Bed-12", admissionDate: "15-Oct-2024", diagnosis: "Pneumonia" },
    { id: 4, name: "Priya Sharma", age: 28, gender: "Female", uhid: "UHID-2024-004", status: "ICU", doctor: "Dr. Mehta", department: "Pediatrics", ward: "ICU-2", bed: "Bed-05", admissionDate: "14-Oct-2024", diagnosis: "Severe Asthma" },
  ],
  rehab: [
    { id: 5, name: "Vikram Singh", age: 60, gender: "Male", uhid: "UHID-2024-005", status: "Active", therapist: "Dr. Desai", program: "Cardiac Rehab", session: "Session 8/12", nextSession: "Tomorrow, 11 AM" },
    { id: 6, name: "Meera Reddy", age: 42, gender: "Female", uhid: "UHID-2024-006", status: "Completed", therapist: "Dr. Desai", program: "Post-Stroke Rehab", session: "Graduated", nextSession: "Follow-up in 1 month" },
  ],
};

const Clinical = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(1);
  const [activeTab, setActiveTab] = useState("opd");
  const [activeSection, setActiveSection] = useState("consultation");
  const [searchTerm, setSearchTerm] = useState("");
  // OPD consultation form fields (for Complete Consultation / Send to Lab validation).
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState("");
  const [investigationAdvised, setInvestigationAdvised] = useState("");
  // IPD Admission form fields (for Transfer Ward validation).
  const [ipdWard, setIpdWard] = useState("General Ward");
  const [ipdBedNumber, setIpdBedNumber] = useState("");
  // Rehab Assessment form fields (for Evaluate Progress).
  const [rehabInitialAssessment, setRehabInitialAssessment] = useState("");
  const [rehabFunctionalAssessment, setRehabFunctionalAssessment] = useState("");
  const [rehabGoalSetting, setRehabGoalSetting] = useState("");

  const tabs = [
    { id: "opd", label: "OPD Clinic", icon: <FaStethoscope /> },
    { id: "ipd", label: "IPD Wards", icon: <FaBed /> },
    { id: "rehab", label: "Rehab Center", icon: <FaWalking /> },
  ];

  const opdSections = [
    { id: "consultation", label: "Consultation", icon: <FaNotesMedical /> },
    { id: "prescription", label: "e-Prescription", icon: <FaPrescription /> },
    { id: "orders", label: "Lab Orders", icon: <FaFileMedicalAlt /> },
    { id: "history", label: "History", icon: <FaHistory /> },
  ];

  const ipdSections = [
    { id: "admission", label: "Admission", icon: <FaRegHospital /> },
    { id: "progress", label: "Progress Notes", icon: <FaClipboardCheck /> },
    { id: "orders", label: "Orders", icon: <FaFileMedicalAlt /> },
    { id: "discharge", label: "Discharge", icon: <FaFileInvoiceDollar /> },
  ];

  const rehabSections = [
    { id: "assessment", label: "Assessment", icon: <FaBrain /> },
    { id: "therapy", label: "Therapy Plan", icon: <FaProcedures /> },
    { id: "sessions", label: "Sessions", icon: <FaCalendarCheck /> },
    { id: "progress", label: "Progress", icon: <FaChartLine /> },
  ];

  const selectedPatientData = patientData[activeTab]?.find((p) => p.id === selectedPatient);

  // --- Complete Consultation: validate Provisional Diagnosis, set status to Completed ---
  const handleCompleteConsultation = () => {
    if (!selectedPatientData) return;
    const trimmed = (provisionalDiagnosis || "").trim();
    if (!trimmed) {
      alert("Please enter Provisional Diagnosis before completing the consultation.");
      return;
    }
    setPatientData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((p) =>
        p.id === selectedPatient ? { ...p, status: "Completed" } : p
      ),
    }));
    alert("Consultation Completed Successfully");
    // Auto-move to next patient if available.
    const list = patientData[activeTab] || [];
    const idx = list.findIndex((p) => p.id === selectedPatient);
    if (idx >= 0 && idx < list.length - 1) {
      setSelectedPatient(list[idx + 1].id);
      setProvisionalDiagnosis("");
      setInvestigationAdvised("");
    }
  };

  // --- Next Patient: switch to next in queue; reset form ---
  const handleNextPatient = () => {
    if (!selectedPatientData) return;
    const list = patientData[activeTab] || [];
    const idx = list.findIndex((p) => p.id === selectedPatient);
    if (idx < 0 || idx >= list.length - 1) {
      alert("No more patients in queue");
      return;
    }
    setSelectedPatient(list[idx + 1].id);
    setProvisionalDiagnosis("");
    setInvestigationAdvised("");
  };

  // --- Send to Lab: validate Investigation Advised, create lab order, update status ---
  const handleSendToLab = () => {
    if (!selectedPatientData) return;
    const tests = (investigationAdvised || "").trim();
    if (!tests) {
      alert("Please enter Investigation Advised before sending to lab.");
      return;
    }
    const labOrder = {
      patientId: selectedPatientData.id,
      patientName: selectedPatientData.name,
      tests,
      status: "Pending",
      date: new Date().toISOString(),
    };
    console.log("Lab order:", labOrder);
    alert("Patient sent to Lab");
    setPatientData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((p) =>
        p.id === selectedPatient ? { ...p, status: "Lab Pending" } : p
      ),
    }));
    navigate("/lab");
  };

  // --- Transfer Ward: validate Bed Number, update patient ward/bed/status to Transferred ---
  const handleTransferWard = () => {
    if (!selectedPatientData) return;
    const bed = (ipdBedNumber || "").trim();
    if (!bed) {
      alert("Please enter Bed Number before transferring ward.");
      return;
    }
    const newWard = ipdWard || "General Ward";
    setPatientData((prev) => ({
      ...prev,
      ipd: prev.ipd.map((p) =>
        p.id === selectedPatient
          ? { ...p, ward: newWard, bed, status: "Transferred" }
          : p
      ),
    }));
    const updated = { ...selectedPatientData, ward: newWard, bed, status: "Transferred" };
    console.log("Updated patient (transfer):", updated);
    alert("Patient transferred successfully");
  };

  // --- Schedule Procedure: build procedure object, log and alert (no navigation) ---
  const handleScheduleProcedure = () => {
    if (!selectedPatientData) return;
    const procedure = {
      patientId: selectedPatientData.id,
      patientName: selectedPatientData.name,
      procedureDate: new Date().toISOString(),
      ward: selectedPatientData.ward,
      doctor: selectedPatientData.doctor,
      status: "Scheduled",
    };
    console.log("Scheduled procedure:", procedure);
    alert("Procedure Scheduled Successfully");
  };

  // --- Initiate Discharge: confirm then set status to Discharge Initiated ---
  const handleInitiateDischarge = () => {
    if (!selectedPatientData) return;
    const confirmed = window.confirm("Are you sure you want to discharge this patient?");
    if (!confirmed) return;
    setPatientData((prev) => ({
      ...prev,
      ipd: prev.ipd.map((p) =>
        p.id === selectedPatient ? { ...p, status: "Discharge Initiated" } : p
      ),
    }));
    alert("Discharge process started");
  };

  // --- Start Session: set rehab patient status to In Session and lastSessionDate ---
  const handleStartSession = () => {
    if (!selectedPatientData) {
      alert("No patient selected");
      return;
    }
    const now = new Date().toISOString();
    setPatientData((prev) => ({
      ...prev,
      rehab: prev.rehab.map((p) =>
        p.id === selectedPatient
          ? { ...p, status: "In Session", lastSessionDate: now }
          : p
      ),
    }));
    const updated = { ...selectedPatientData, status: "In Session", lastSessionDate: now };
    console.log("Updated patient (session started):", updated);
    alert("Therapy session started");
  };

  // --- Evaluate Progress: build progress object from assessment fields, log and alert ---
  const handleEvaluateProgress = () => {
    if (!selectedPatientData) {
      alert("No patient selected");
      return;
    }
    const progress = {
      patientId: selectedPatientData.id,
      patientName: selectedPatientData.name,
      assessmentDate: new Date().toISOString(),
      initialAssessment: rehabInitialAssessment || "",
      functionalAssessment: rehabFunctionalAssessment || "",
      goals: rehabGoalSetting || "",
      therapist: selectedPatientData.therapist || "",
    };
    console.log("Progress evaluation:", progress);
    alert("Progress Evaluated Successfully");
  };

  // --- Discharge from Rehab: confirm then set status Completed and dischargeDate ---
  const handleDischargeRehab = () => {
    if (!selectedPatientData) {
      alert("No patient selected");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to discharge this patient from rehab?"
    );
    if (!confirmed) return;
    const dischargeDate = new Date().toISOString();
    setPatientData((prev) => ({
      ...prev,
      rehab: prev.rehab.map((p) =>
        p.id === selectedPatient
          ? { ...p, status: "Completed", dischargeDate }
          : p
      ),
    }));
    alert("Patient discharged from Rehab");
  };

  return (
    <div className="dashboard">
      {/* ================= HEADER ================= */}
      <header className="dashboard-header">
        <div className="header-left">
          {/* Back Arrow */}
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
            title="Back to Dashboard"
          >
            <FaArrowLeft />
          </button>

          <div className="logo-title-container">
            <img
              src={swastikLogo}
              alt="Swastik Hospital"
              className="header-logo"
            />
            <div className="header-text">
              <h1>Clinical Management</h1>
              <p className="hospital-tagline">
                Swastik Hospital - Integrated Healthcare System
              </p>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="doctor-info">
            <span className="doctor-name">
              <FaUserMd /> Dr. Rajesh Kumar
            </span>
            <span className="doctor-specialization">Senior Cardiologist</span>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="clinical-main">
        <div className="clinical-container">
          {/* Left Sidebar - Patient Queue */}
          <aside className="clinical-sidebar">
            <div className="sidebar-header">
              {/* Main Tabs */}
              <div className="main-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`main-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedPatient(patientData[tab.id]?.[0]?.id || 1);
                      setActiveSection(tab.id === 'opd' ? 'consultation' : 
                                     tab.id === 'ipd' ? 'admission' : 'assessment');
                    }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Search and Stats */}
              <div className="queue-header">
                <h3>
                  {activeTab === 'opd' && <><FaStethoscope /> OPD Queue</>}
                  {activeTab === 'ipd' && <><FaBed /> IPD Patients</>}
                  {activeTab === 'rehab' && <><FaWalking /> Rehab Patients</>}
                  <span className="queue-count">
                    {patientData[activeTab]?.length || 0} Patients
                  </span>
                </h3>
                <div className="queue-filters">
                  <div className="search-box">
                    <FaSearch />
                    <input 
                      type="text" 
                      placeholder={`Search ${activeTab} patients...`} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="patient-queue">
              {patientData[activeTab]?.map((patient) => (
                <div 
                  key={patient.id}
                  className={`patient-card ${selectedPatient === patient.id ? 'active' : ''}`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="patient-card-header">
                    {activeTab === 'opd' && (
                      <>
                        <span className="patient-token">Token #{patient.token}</span>
                        <span className={`patient-status ${patient.status.toLowerCase().replace(' ', '-')}`}>
                          {patient.status}
                        </span>
                      </>
                    )}
                    {activeTab === 'ipd' && (
                      <>
                        <span className="patient-token">Ward: {patient.ward}</span>
                        <span className={`patient-status ${patient.status.toLowerCase()}`}>
                          {patient.status}
                        </span>
                      </>
                    )}
                    {activeTab === 'rehab' && (
                      <>
                        <span className="patient-token">Program: {patient.program}</span>
                        <span className={`patient-status ${patient.status.toLowerCase()}`}>
                          {patient.status}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="patient-info">
                    <h4>{patient.name}</h4>
                    <p>{patient.age} years, {patient.gender} | {patient.uhid}</p>
                    <div className="patient-meta">
                      {activeTab === 'opd' && (
                        <>
                          <span className="patient-doctor">
                            <FaUserMd /> {patient.doctor}
                          </span>
                          <span className="patient-time">{patient.time}</span>
                        </>
                      )}
                      {activeTab === 'ipd' && (
                        <>
                          <span className="patient-doctor">
                            <FaBed /> {patient.ward} - {patient.bed}
                          </span>
                          <span className="patient-time">Adm: {patient.admissionDate}</span>
                        </>
                      )}
                      {activeTab === 'rehab' && (
                        <>
                          <span className="patient-doctor">
                            <FaUserMd /> {patient.therapist}
                          </span>
                          <span className="patient-time">{patient.session}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Workspace */}
          <section className="clinical-workspace">
            {/* Patient Header */}
            <div className="patient-header">
              <div className="patient-title">
                <h2>
                  {selectedPatientData?.name}
                  <span className="patient-uhid">{selectedPatientData?.uhid}</span>
                </h2>
                <div className="patient-subtitle">
                  <span>{selectedPatientData?.age} years, {selectedPatientData?.gender}</span>
                  {activeTab === 'opd' && (
                    <>
                      <span>• {selectedPatientData?.department}</span>
                      <span className={`priority-badge ${selectedPatientData?.priority?.toLowerCase()}`}>
                        {selectedPatientData?.priority} Priority
                      </span>
                    </>
                  )}
                  {activeTab === 'ipd' && (
                    <>
                      <span>• {selectedPatientData?.diagnosis}</span>
                      <span>• Ward: {selectedPatientData?.ward} | Bed: {selectedPatientData?.bed}</span>
                    </>
                  )}
                  {activeTab === 'rehab' && (
                    <>
                      <span>• {selectedPatientData?.program}</span>
                      <span>• Therapist: {selectedPatientData?.therapist}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="patient-actions">
                <button className="action-btn print-btn">
                  <FaPrint /> Print
                </button>
                <button className="action-btn save-btn">
                  <FaSave /> Save
                </button>
              </div>
            </div>

            {/* Section Tabs */}
            <div className="section-tabs">
              {activeTab === 'opd' && opdSections.map((section) => (
                <button
                  key={section.id}
                  className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
              {activeTab === 'ipd' && ipdSections.map((section) => (
                <button
                  key={section.id}
                  className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
              {activeTab === 'rehab' && rehabSections.map((section) => (
                <button
                  key={section.id}
                  className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </div>

            {/* Section Content: delegated to OPD/IPD/Rehab containers */}
            <div className="section-content">
              {activeTab === "opd" && (
                <OPDContainer
                  activeSection={activeSection}
                  provisionalDiagnosis={provisionalDiagnosis}
                  setProvisionalDiagnosis={setProvisionalDiagnosis}
                  investigationAdvised={investigationAdvised}
                  setInvestigationAdvised={setInvestigationAdvised}
                />
              )}
              {activeTab === "ipd" && (
                <IPDContainer
                  activeSection={activeSection}
                  ipdWard={ipdWard}
                  setIpdWard={setIpdWard}
                  ipdBedNumber={ipdBedNumber}
                  setIpdBedNumber={setIpdBedNumber}
                />
              )}
              {activeTab === "rehab" && (
                <RehabContainer
                  activeSection={activeSection}
                  rehabInitialAssessment={rehabInitialAssessment}
                  setRehabInitialAssessment={setRehabInitialAssessment}
                  rehabFunctionalAssessment={rehabFunctionalAssessment}
                  setRehabFunctionalAssessment={setRehabFunctionalAssessment}
                  rehabGoalSetting={rehabGoalSetting}
                  setRehabGoalSetting={setRehabGoalSetting}
                />
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              {activeTab === 'opd' && (
                <>
                  <button
                    className="quick-action-btn complete-btn"
                    onClick={handleCompleteConsultation}
                    disabled={!selectedPatientData}
                  >
                    Complete Consultation
                  </button>
                  <button
                    className="quick-action-btn next-btn"
                    onClick={handleNextPatient}
                    disabled={!selectedPatientData}
                  >
                    Next Patient
                  </button>
                  <button
                    className="quick-action-btn lab-btn"
                    onClick={handleSendToLab}
                    disabled={!selectedPatientData}
                  >
                    Send to Lab
                  </button>
                </>
              )}
              {activeTab === 'ipd' && (
                <>
                  <button
                    className="quick-action-btn transfer-btn"
                    onClick={handleTransferWard}
                    disabled={!selectedPatientData}
                  >
                    Transfer Ward
                  </button>
                  <button
                    className="quick-action-btn procedure-btn"
                    onClick={handleScheduleProcedure}
                    disabled={!selectedPatientData}
                  >
                    Schedule Procedure
                  </button>
                  <button
                    className="quick-action-btn discharge-btn"
                    onClick={handleInitiateDischarge}
                    disabled={!selectedPatientData}
                  >
                    Initiate Discharge
                  </button>
                </>
              )}
              {activeTab === 'rehab' && (
                <>
                  <button
                    className="quick-action-btn session-btn"
                    onClick={handleStartSession}
                    disabled={!selectedPatientData}
                  >
                    Start Session
                  </button>
                  <button
                    className="quick-action-btn evaluate-btn"
                    onClick={handleEvaluateProgress}
                    disabled={!selectedPatientData}
                  >
                    Evaluate Progress
                  </button>
                  <button
                    className="quick-action-btn discharge-btn"
                    onClick={handleDischargeRehab}
                    disabled={!selectedPatientData}
                  >
                    Discharge from Rehab
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p className="copyright">
              © {new Date().getFullYear()}Swastik Hospital. All rights reserved. | Developed and managed by ORELSE Private Limited.
            </p>
            {/* <p className="footer-address">
              123 Hospital Road, Medical District, City - 560001 | 📞 1800-123-4567
            </p> */}
          </div>

          {/* <div className="footer-right">
            <div className="powered-by">
              <span>Powered by</span>
              <img
                src={orelseLogo}
                alt="Orelse"
                className="orelese-logo"
              />
            </div>
          </div> */}
        </div>
      </footer>
    </div>
  );
};

export default Clinical;