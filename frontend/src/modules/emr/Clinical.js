import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaSearch, FaUserMd, FaStethoscope,
  FaPrescription, FaFileMedicalAlt, FaBed, FaPrint,
  FaSave, FaHistory, FaChartLine,
  FaProcedures, FaBrain, FaWalking, FaNotesMedical, FaClipboardCheck,
  FaFileInvoiceDollar, FaCalendarCheck, FaRegHospital
} from "react-icons/fa";
import { api } from "../../api/service";
import "./Clinical.css";
import swastikLogo from "../../assets/swastiklogo.png";

import OPDContainer from "./opd/OPDContainer";
import IPDContainer from "./ipd/IPDContainer";
import RehabContainer from "./rehab/RehabContainer";

const mapOpdToPatient = (r, i) => ({
  id: r._id || i + 1,
  token: (i + 1) * 100,
  name: r.patient_name || "—",
  uhid: r.uhid || "—",
  status: "Waiting",
  doctor: r.doctor_id || "—",
  department: r.department || "—",
  time: "—",
  priority: "Normal",
  lastVisit: r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—",
  allergies: [],
});

const mapIpdToPatient = (r, i) => ({
  id: r._id || i + 1,
  name: r.patient_name || "—",
  uhid: r.uhid || "—",
  status: r.status || "Admitted",
  doctor: "—",
  department: "—",
  ward: r.ward || "—",
  bed: r.bed_number || "—",
  admissionDate: r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—",
  diagnosis: r.admission_reason || "—",
});

const mapAppointmentToRehab = (a, i) => ({
  id: a._id || i + 1,
  name: a.patient_name || "—",
  uhid: a.uhid || "—",
  status: a.status === "scheduled" ? "Active" : "Completed",
  therapist: a.doctor_id || "—",
  program: a.type || "Therapy",
  session: "—",
  nextSession: a.appointment_date ? new Date(a.appointment_date).toLocaleDateString("en-IN") : "—",
});

const initialPatients = {
  opd: [],
  ipd: [],
  rehab: [],
};

const Clinical = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("opd");
  const [activeSection, setActiveSection] = useState("consultation");

  // State for OPD Consultation and Prescription
  const [consultationData, setConsultationData] = useState({
    chiefComplaint: "",
    mse: {},
    phq9: Array(9).fill(0),
    gad7: Array(7).fill(0),
    diagnosis: "",
    investigationAdvised: "",
  });
  const [prescriptionData, setPrescriptionData] = useState({
    medications: [],
    notes: ""
  });

  // unified IPD state
  const [ipdAdmissionData, setIpdAdmissionData] = useState({
    date: new Date().toISOString().split("T")[0],
    ward: "Psychiatric Ward-A",
    bedNumber: "",
    doctor: "Dr. P. M. Chougule",
    diagnosis: "",
    reason: ""
  });
  const [ipdProgressData, setIpdProgressData] = useState({
    riskLevel: "Low",
    riskNotes: "",
    dailyNote: "",
    behaviorLogs: [],
    therapySummary: "",
  });

  // unified Rehab state
  const [rehabData, setRehabData] = useState({
    initialAssessment: "",
    psychologicalHistory: "",
    socialSupport: "",
    therapyType: "CBT",
    therapyFrequency: "Daily",
    therapyDetails: "",
    assignedTherapist: "Dr. Nikhil Chougule",
    startDate: new Date().toISOString().split("T")[0],
    targetDate: "",
    sessions: [],
    progressLog: "",
    relapseRisk: "Low",
    addictionStatus: "Stable",
    daysSobriety: 0
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Promise.all([
      api.getOPDList().then((list) => (Array.isArray(list) ? list : []).map(mapOpdToPatient)),
      api.getIPDList().then((list) => (Array.isArray(list) ? list : []).map(mapIpdToPatient)),
      api.getAppointments().then((list) => (Array.isArray(list) ? list : []).map(mapAppointmentToRehab)),
    ])
      .then(([opd, ipd, rehab]) => {
        setPatientData({ opd, ipd, rehab });
        setSelectedPatient((prev) => {
          const list = { opd, ipd, rehab }[activeTab] || [];
          const first = list[0];
          return first ? first.id : prev;
        });
      })
      .catch(() => { });
  }, [activeTab]);

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

  // --- OPD Actions: Save & Print ---
  const handleCompleteConsultation = async () => {
    if (!selectedPatientData) return;
    try {
      await api.saveConsultation(selectedPatientData.uhid, consultationData);
      alert("Consultation saved successfully");
      handlePrintConsultation();

      // Update local status
      setPatientData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((p) =>
          p.id === selectedPatient ? { ...p, status: "Completed" } : p
        ),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to save consultation: " + err.message);
    }
  };

  const handleSavePrescription = async () => {
    if (!selectedPatientData) return;
    try {
      await api.savePrescription(selectedPatientData.uhid, prescriptionData);
      alert("Prescription saved successfully");
      handlePrintPrescription();
    } catch (err) {
      console.error(err);
      alert("Failed to save prescription: " + err.message);
    }
  };

  const handlePrintConsultation = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>Consultation - ${selectedPatientData.name}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #1e40af; padding-bottom: 15px; margin-bottom: 25px; }
        .hospital-name { font-size: 28px; font-weight: bold; color: #1e40af; }
        .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 25px; }
        h3 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; }
        .section { margin-bottom: 25px; }
        .label { font-weight: bold; color: #334155; min-width: 140px; display: inline-block; }
        .sig-row { margin-top: 80px; display: flex; justify-content: space-between; padding: 0 40px; }
        .sig-box { text-align: center; border-top: 1px solid #64748b; width: 180px; padding-top: 10px; color: #64748b; }
      </style></head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">SWASTIK HOSPITAL</div>
            <div style="color: #64748b; font-weight: 500;">Psychiatric & Rehabilitation Centre</div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 18px; font-weight: bold; color: #1e40af;">CONSULTATION SUMMARY</div>
            <div style="color: #64748b;">Visit Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
        <div class="patient-info">
          <div><span class="label">Patient Name:</span> ${selectedPatientData.name}</div>
          <div><span class="label">UHID / ID:</span> ${selectedPatientData.uhid}</div>
          <div><span class="label">Age / Gender:</span> ${selectedPatientData.age} / ${selectedPatientData.gender}</div>
          <div><span class="label">Doctor:</span> ${selectedPatientData.doctor}</div>
        </div>
        <div class="section">
          <h3>H/O Presentation</h3>
          <div><span class="label">Chief Complaint:</span> ${consultationData.chiefComplaint || "N/A"}</div>
          <p>${consultationData.history || ""}</p>
        </div>
        <div class="section">
          <h3>Mental Status Examination</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            ${Object.entries(consultationData.mse || {}).map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join("")}
          </div>
        </div>
        <div class="section">
          <h3>Diagnosis & Plan</h3>
          <p><strong>Primary Diagnosis:</strong> ${consultationData.diagnosis || "Provisional"}</p>
          <p><strong>Treatment Plan:</strong> ${consultationData.therapyPlan || "Follow-up advised"}</p>
          <p><strong>Investigation Advised:</strong> ${consultationData.investigationAdvised || "None"}</p>
        </div>
        <div class="sig-row">
          <div class="sig-box">Patient/Guardian</div>
          <div class="sig-box">Consulting Psychiatrist</div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handlePrintPrescription = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>Prescription - ${selectedPatientData.name}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1e40af; padding-bottom: 15px; margin-bottom: 30px; }
        .hospital-name { font-size: 28px; font-weight: bold; color: #1e40af; }
        .patient-info { border: 1px solid #ccc; padding: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; }
        .rx-symbol { font-size: 40px; color: #1e40af; margin-bottom: 10px; font-family: serif; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { border-bottom: 2px solid #1e40af; text-align: left; padding: 10px; background: #f8fafc; }
        td { border-bottom: 1px solid #eee; padding: 12px 10px; }
        .footer { margin-top: 80px; display: flex; justify-content: space-between; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #64748b; }
      </style></head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">SWASTIK HOSPITAL</div>
            <div style="font-weight: bold;">Dr. P. M. Chougule</div>
            <div style="font-size: 14px;">M.D. (Psych), D.P.M. | Reg No: 12345</div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 22px; font-weight: bold; color: #1e40af;">PRESCRIPTION</div>
            <div>Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
        <div class="patient-info">
          <div><strong>Name:</strong> ${selectedPatientData.name}</div>
          <div><strong>UHID:</strong> ${selectedPatientData.uhid}</div>
          <div><strong>Age/Sex:</strong> ${selectedPatientData.age} / ${selectedPatientData.gender}</div>
        </div>
        <div class="rx-symbol">Rx</div>
        <table>
          <thead><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead>
          <tbody>
            ${(prescriptionData.medications || []).map(m => `
              <tr>
                <td><strong>${m.name}</strong><br/><small style="color:#666">${m.notes || ''}</small></td>
                <td>${m.dosage}</td>
                <td>${m.frequency}</td>
                <td>${m.duration}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div style="margin-top: 20px; border-left: 4px solid #1e40af; padding-left: 15px;">
          <strong>General Advice:</strong><br/>
          <p>${prescriptionData.notes || "Standard psychiatric care advised."}</p>
        </div>
        <div class="footer">
          <div>Swastik Hospital, Near City Plaza, Main Road, Kolhapur</div>
          <div style="text-align: right; transform: translateY(-20px);">
            <div style="margin-bottom: 40px; border-bottom: 1px solid #ccc; width: 150px; margin-left: auto;"></div>
            Digitally Signed By: Dr. P. M. Chougule
          </div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  function handlePrintIPDAdmission() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>IPD Admission - ${selectedPatientData.name}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #1e40af; padding-bottom: 15px; margin-bottom: 25px; }
        .hospital-name { font-size: 28px; font-weight: bold; color: #1e40af; }
        .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 25px; }
        h3 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; }
        .label { font-weight: bold; color: #334155; min-width: 140px; display: inline-block; }
        .section { margin-bottom: 25px; }
        .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #64748b; }
      </style></head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">SWASTIK HOSPITAL</div>
            <div style="color: #64748b; font-weight: 500;">Psychiatric & Rehabilitation Centre</div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 18px; font-weight: bold; color: #1e40af;">IPD ADMISSION DETAILS</div>
            <div style="color: #64748b;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
        <div class="patient-info">
          <div><span class="label">Patient Name:</span> ${selectedPatientData.name}</div>
          <div><span class="label">UHID / ID:</span> ${selectedPatientData.uhid}</div>
          <div><span class="label">Age / Gender:</span> ${selectedPatientData.age} / ${selectedPatientData.gender}</div>
          <div><span class="label">Admitting Doctor:</span> ${ipdAdmissionData.doctor || "N/A"}</div>
        </div>
        <div class="section">
          <h3>Admission Particulars</h3>
          <p><span class="label">Admission Date:</span> ${ipdAdmissionData.date || "N/A"}</p>
          <p><span class="label">Ward:</span> ${ipdAdmissionData.ward || "N/A"}</p>
          <p><span class="label">Bed Number:</span> ${ipdAdmissionData.bedNumber || "N/A"}</p>
        </div>
        <div class="section">
          <h3>Diagnosis & Clinical Justification</h3>
          <p><strong>Admission Diagnosis:</strong> ${ipdAdmissionData.diagnosis || "Provisional"}</p>
          <p><strong>Reason for Admission & Risk Assessment:</strong> ${ipdAdmissionData.reason || "N/A"}</p>
        </div>
        <div class="footer">
          Digitally Generated By Swastik HMS | Registration Date: ${selectedPatientData.regDate || "N/A"}
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  function handlePrintIPDProgress() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>IPD Progress Note - ${selectedPatientData.name}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #1e40af; padding-bottom: 15px; margin-bottom: 25px; }
        .hospital-name { font-size: 28px; font-weight: bold; color: #1e40af; }
        .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 25px; }
        h3 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; }
        .label { font-weight: bold; color: #334155; min-width: 140px; display: inline-block; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
        th { background: #f8fafc; color: #1e40af; }
        .risk-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .risk-low { background: #dcfce7; color: #166534; }
        .risk-moderate { background: #fef9c3; color: #854d0e; }
        .risk-high { background: #fee2e2; color: #991b1b; }
      </style></head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">SWASTIK HOSPITAL</div>
            <div style="color: #64748b; font-weight: 500;">Psychiatric IPD Ward</div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 18px; font-weight: bold; color: #1e40af;">DAILY PROGRESS RECORD</div>
            <div style="color: #64748b;">Record Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
        <div class="patient-info">
          <div><span class="label">Patient Name:</span> ${selectedPatientData.name}</div>
          <div><span class="label">UHID / ID:</span> ${selectedPatientData.uhid}</div>
          <div><span class="label">Risk Level Today:</span> <span class="risk-badge risk-${(ipdProgressData.riskLevel || 'low').toLowerCase()}">${ipdProgressData.riskLevel || 'Low'}</span></div>
          <div><span class="label">Ward/Bed:</span> ${selectedPatientData.ward || "N/A"} / ${selectedPatientData.bed || "N/A"}</div>
        </div>
        <h3>Psychiatric Progress Summary</h3>
        <p>${ipdProgressData.dailyNote || "No notes recorded for today."}</p>
        
        <h3>Risk Assessment Notes</h3>
        <p>${ipdProgressData.riskNotes || "N/A"}</p>

        <h3>Therapy Summary</h3>
        <p>${ipdProgressData.therapySummary || "No therapy sessions recorded."}</p>

        <h3>Behavior Observation Log</h3>
        <table>
          <thead><tr><th>Time</th><th>Clinical Observation</th><th>Risk Level</th></tr></thead>
          <tbody>
            ${(ipdProgressData.behaviorLogs || []).map(log => `
              <tr>
                <td>${log.time}</td>
                <td>${log.observation}</td>
                <td><span class="risk-badge risk-${log.risk.toLowerCase()}">${log.risk}</span></td>
              </tr>
            `).join("") || "<tr><td colspan='3' style='text-align:center;'>No log entries</td></tr>"}
          </tbody>
        </table>
        <div style="margin-top: 50px; text-align: right;">
          <div style="margin-bottom: 40px; border-bottom: 1px solid #ccc; width: 200px; margin-left: auto;"></div>
          <span>Duty Doctor / Psychiatrist Signature</span>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  function handlePrintRehabAssessment() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>Rehab Assessment - ${selectedPatientData.name}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #065f46; padding-bottom: 15px; margin-bottom: 25px; }
        .hospital-name { font-size: 28px; font-weight: bold; color: #065f46; }
        .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f0fdf4; padding: 20px; border: 1px solid #dcfce7; margin-bottom: 25px; }
        h3 { color: #065f46; border-bottom: 2px solid #dcfce7; padding-bottom: 8px; margin-top: 30px; }
        .label { font-weight: bold; color: #1e293b; min-width: 160px; display: inline-block; }
        .section { margin-bottom: 25px; }
        .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #64748b; }
      </style></head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">SWASTIK HOSPITAL</div>
            <div style="color: #64748b; font-weight: 500;">Rehabilitation & Recovery Centre</div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 18px; font-weight: bold; color: #065f46;">REHAB ASSESSMENT REPORT</div>
            <div style="color: #64748b;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
        <div class="patient-info">
          <div><span class="label">Patient Name:</span> ${selectedPatientData.name}</div>
          <div><span class="label">UHID:</span> ${selectedPatientData.uhid}</div>
          <div><span class="label">Age / Gender:</span> ${selectedPatientData.age} / ${selectedPatientData.gender}</div>
          <div><span class="label">Provisional Diagnosis:</span> ${selectedPatientData.diagnosis || "Psychiatric Care"}</div>
        </div>
        <div class="section">
          <h3>Psychological & Clinical History</h3>
          <p>${rehabData.psychologicalHistory || "N/A"}</p>
        </div>
        <div class="section">
          <h3>Social & Family Support</h3>
          <p>${rehabData.socialSupport || "N/A"}</p>
        </div>
        <div class="section">
          <h3>Initial Rehab Evaluation</h3>
          <p>${rehabData.initialAssessment || "N/A"}</p>
        </div>
        <div class="footer">
          Generated via Swastik HMS | Rehab Management Module
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  }

  function handlePrintRehabTherapy() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>Rehab Therapy Plan - ${selectedPatientData.name}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #065f46; padding-bottom: 15px; margin-bottom: 25px; }
        .hospital-name { font-size: 28px; font-weight: bold; color: #065f46; }
        .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f0fdf4; padding: 20px; border: 1px solid #dcfce7; margin-bottom: 25px; }
        h3 { color: #065f46; border-bottom: 2px solid #dcfce7; padding-bottom: 8px; margin-top: 30px; }
        .label { font-weight: bold; color: #1e293b; min-width: 160px; display: inline-block; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; }
      </style></head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">SWASTIK HOSPITAL</div>
            <div style="color: #64748b; font-weight: 500;">Therapy & Counseling Services</div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 18px; font-weight: bold; color: #065f46;">THERAPY CARE PLAN</div>
            <div style="color: #64748b;">Generated: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>
        <div class="patient-info">
          <div><span class="label">Patient Name:</span> ${selectedPatientData.name}</div>
          <div><span class="label">Assigned Therapist:</span> ${rehabData.assignedTherapist || "N/A"}</div>
          <div><span class="label">Therapy Type:</span> ${rehabData.therapyType || "N/A"}</div>
          <div><span class="label">Frequency:</span> ${rehabData.therapyFrequency || "N/A"}</div>
          <div><span class="label">Start Date:</span> ${rehabData.startDate || "N/A"}</div>
          <div><span class="label">Target Date:</span> ${rehabData.targetDate || "N/A"}</div>
        </div>
        <h3>Therapy Protocol & Objectives</h3>
        <p>${rehabData.therapyDetails || "Standard protocol advised."}</p>
        <div style="margin-top: 80px; display: flex; justify-content: space-between;">
          <div style="border-top: 1px solid #000; width: 180px; text-align: center;">Therapist Signature</div>
          <div style="border-top: 1px solid #000; width: 180px; text-align: center;">Clinical Director</div>
        </div>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  }

  function handlePrintRehabSessions() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>Session History - ${selectedPatientData.name}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #065f46; padding-bottom: 15px; margin-bottom: 25px; }
        .hospital-name { font-size: 28px; font-weight: bold; color: #065f46; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; font-size: 13px; }
        th { background-color: #f8fafc; color: #065f46; }
      </style></head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">SWASTIK HOSPITAL</div>
            <div style="color: #64748b;">Rehab Therapy log</div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 18px; font-weight: bold; color: #065f46;">SESSION HISTORY RECORD</div>
            <div>UHID: ${selectedPatientData.uhid} | Name: ${selectedPatientData.name}</div>
          </div>
        </div>
        <table>
          <thead><tr><th>Date</th><th>Type</th><th>Duration</th><th>Outcome</th><th>Clinical Observations</th></tr></thead>
          <tbody>
            ${(rehabData.sessions || []).map(s => `
              <tr>
                <td>${s.date}</td>
                <td>${s.type}</td>
                <td>${s.duration}m</td>
                <td>${s.outcome}/10 (${s.sentiment})</td>
                <td>${s.notes}</td>
              </tr>
            `).join("") || "<tr><td colspan='5' style='text-align:center'>No sessions recorded</td></tr>"}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  }

  function handlePrintRehabProgress() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html><head><title>Progress Report - ${selectedPatientData.name}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #065f46; padding-bottom: 15px; margin-bottom: 25px; }
        .hospital-name { font-size: 28px; font-weight: bold; color: #065f46; }
        .status-box { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px; }
        .label { font-weight: bold; color: #1e293b; width: 180px; display: inline-block; }
        h3 { color: #065f46; border-bottom: 2px solid #f0fdf4; padding-bottom: 5px; }
      </style></head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">SWASTIK HOSPITAL</div>
            <div style="color: #64748b;">Recovery Monitoring</div>
          </div>
          <div style="text-align: right">
            <div style="font-size: 18px; font-weight: bold; color: #065f46;">MONTHLY PROGRESS SUMMARY</div>
            <div>Patient: ${selectedPatientData.name} (${selectedPatientData.uhid})</div>
          </div>
        </div>
        <div class="status-box">
          <div><span class="label">Relapse Risk:</span> ${rehabData.relapseRisk || "Low"}</div>
          <div><span class="label">Addiction Status:</span> ${rehabData.addictionStatus || "Stable"}</div>
          <div><span class="label">Days of Sobriety:</span> ${rehabData.daysSobriety || 0} Days</div>
          <div><span class="label">Avg Session Score:</span> ${rehabData.sessions?.length > 0 ? (rehabData.sessions.reduce((a, b) => a + b.outcome, 0) / rehabData.sessions.length).toFixed(1) : "N/A"}/10</div>
        </div>
        <h3>Relapse Prevention Notes</h3>
        <p>${rehabData.relapseNotes || "N/A"}</p>
        <h3>General Progress Log</h3>
        <p>${rehabData.progressLog || "N/A"}</p>
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  }

  const handleNextPatient = () => {
    if (!selectedPatientData) return;
    const list = patientData[activeTab] || [];
    const idx = list.findIndex((p) => p.id === selectedPatient);
    if (idx < 0 || idx >= list.length - 1) {
      alert("No more patients in queue");
      return;
    }
    setSelectedPatient(list[idx + 1].id);
  };

  // --- IPD Actions ---
  const handleTransferWard = async () => {
    if (!selectedPatientData) return;
    const bed = (ipdAdmissionData.bedNumber || "").trim();
    if (!bed) {
      alert("Please enter Bed Number");
      return;
    }
    try {
      await api.updateIPDAction(selectedPatientData.uhid, "transfer", {
        ward: ipdAdmissionData.ward,
        bed_number: ipdAdmissionData.bedNumber
      });
      alert("Patient transferred successfully");
      setPatientData((prev) => ({
        ...prev,
        ipd: prev.ipd.map((p) =>
          p.id === selectedPatient ? { ...p, ward: ipdAdmissionData.ward, bed: ipdAdmissionData.bedNumber } : p
        ),
      }));
    } catch (err) {
      console.error(err);
      alert("Transfer failed: " + err.message);
    }
  };

  const handleInitiateDischarge = async () => {
    if (!selectedPatientData) return;
    if (!window.confirm("Initiate discharge process?")) return;
    try {
      await api.updateIPDAction(selectedPatientData.uhid, "discharge_initiate", {});
      alert("Discharge initiated");
      setPatientData((prev) => ({
        ...prev,
        ipd: prev.ipd.map((p) =>
          p.id === selectedPatient ? { ...p, status: "Discharge Initiated" } : p
        ),
      }));
    } catch (err) {
      console.error(err);
      alert("Discharge initiation failed");
    }
  };

  // --- Rehab Actions ---
  const handleStartSession = async () => {
    if (!selectedPatientData) return;
    try {
      await api.saveRehabData(selectedPatientData.uhid, "SessionStarted", {
        time: new Date().toISOString()
      });
      alert("Therapy session started and logged");
      setPatientData((prev) => ({
        ...prev,
        rehab: prev.rehab.map((p) =>
          p.id === selectedPatient ? { ...p, status: "In Session" } : p
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEvaluateProgress = async () => {
    if (!selectedPatientData) return;
    try {
      await api.saveRehabData(selectedPatientData.uhid, "Evaluation", {
        initial: rehabData.initialAssessment
      });
      alert("Rehab progress evaluation saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const handleSendToLab = async () => {
    if (!selectedPatientData) return;
    const tests = (consultationData.investigationAdvised || "").trim();
    if (!tests) {
      alert("Please enter Investigation Advised before sending to lab.");
      return;
    }
    try {
      const labOrder = {
        uhid: selectedPatientData.uhid,
        patientName: selectedPatientData.name,
        tests,
        source: activeTab === "opd" ? "OPD" : "IPD",
        priority: selectedPatientData.priority || "Normal",
      };
      await api.createLabRequest(labOrder);
      alert("Patient sent to Lab successfully");
      navigate("/lab");
    } catch (err) {
      console.error(err);
      alert("Failed to send to Lab: " + err.message);
    }
  };

  const handleScheduleProcedure = async () => {
    if (!selectedPatientData) return;
    alert("Procedure scheduling feature coming soon. Use IPD Admission for primary diagnosis.");
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
              <FaUserMd /> Dr. P. M. Chougule
            </span>
            <span className="doctor-specialization">Consulting Psychiatrist</span>
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
              {(patientData[activeTab] || [])
                .filter(p =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.uhid.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((patient) => (
                  <div
                    key={patient.id}
                    className={`patient-card ${selectedPatient === patient.id ? "active" : ""}`}
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
                <button className="action-btn print-btn" onClick={() => {
                  if (activeTab === 'opd') {
                    if (activeSection === 'prescription') handlePrintPrescription();
                    else handlePrintConsultation();
                  } else if (activeTab === 'ipd') {
                    if (activeSection === 'admission') handlePrintIPDAdmission();
                    else if (activeSection === 'progress') handlePrintIPDProgress();
                    else window.print();
                  } else if (activeTab === 'rehab') {
                    if (activeSection === 'assessment') handlePrintRehabAssessment();
                    else if (activeSection === 'therapy') handlePrintRehabTherapy();
                    else if (activeSection === 'sessions') handlePrintRehabSessions();
                    else if (activeSection === 'progress') handlePrintRehabProgress();
                    else window.print();
                  } else {
                    window.print(); // Fallback Generic Page Print for others
                  }
                }}>
                  <FaPrint /> Print
                </button>
                <button className="action-btn save-btn" onClick={async () => {
                  if (activeTab === 'opd') {
                    if (activeSection === 'prescription') await handleSavePrescription();
                    else await handleCompleteConsultation();
                  } else if (activeTab === 'ipd') {
                    if (activeSection === 'admission') {
                      try {
                        await api.saveIPDAdmissionDetails(selectedPatientData.uhid, ipdAdmissionData);
                        alert("Admission details saved");
                      } catch (e) { alert("Save failed"); }
                    } else if (activeSection === 'progress') {
                      try {
                        await api.saveIPDProgressNote(selectedPatientData.uhid, ipdProgressData);
                        alert("Progress note saved");
                      } catch (e) { alert("Save failed"); }
                    }
                  } else if (activeTab === 'rehab') {
                    try {
                      await api.saveRehabData(selectedPatientData.uhid, activeSection, rehabData);
                      alert(`Rehab ${activeSection} saved`);
                    } catch (e) { alert("Save failed"); }
                  }
                }}>
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
                  consultationData={consultationData}
                  setConsultationData={setConsultationData}
                  prescriptionData={prescriptionData}
                  setPrescriptionData={setPrescriptionData}
                  patientData={selectedPatientData}
                />
              )}
              {activeTab === "ipd" && (
                <IPDContainer
                  activeSection={activeSection}
                  admissionData={ipdAdmissionData}
                  setAdmissionData={setIpdAdmissionData}
                  progressData={ipdProgressData}
                  setProgressData={setIpdProgressData}
                  onSaveAdmission={async () => {
                    try {
                      await api.saveIPDAdmissionDetails(selectedPatientData.uhid, ipdAdmissionData);
                      alert("Admission details saved");
                    } catch (e) { alert("Save failed"); }
                  }}
                  onSaveProgress={async () => {
                    try {
                      await api.saveIPDProgressNote(selectedPatientData.uhid, ipdProgressData);
                      alert("Progress note saved");
                    } catch (e) { alert("Save failed"); }
                  }}
                />
              )}
              {activeTab === "rehab" && (
                <RehabContainer
                  activeSection={activeSection}
                  rehabData={rehabData}
                  setRehabData={setRehabData}
                  onSave={async (type) => {
                    try {
                      await api.saveRehabData(selectedPatientData.uhid, type, rehabData);
                      alert(`Rehab ${type} saved successfully`);
                    } catch (e) { alert("Save failed"); }
                  }}
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