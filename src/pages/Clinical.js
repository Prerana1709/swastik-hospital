import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaSearch, FaFilter, FaUserMd, FaStethoscope, 
  FaPrescription, FaFileMedicalAlt, FaBed, FaFilePdf, FaPrint, 
  FaSave, FaCalendar, FaHistory, FaChartLine, FaHeartbeat, 
  FaProcedures, FaBrain, FaWalking, FaNotesMedical, FaClipboardCheck,
  FaFileInvoiceDollar, FaCalendarCheck, FaUserInjured, FaRegHospital
} from "react-icons/fa";
import "./Clinical.css";

import swastikLogo from "../assets/swastiklogo.png";
import orelseLogo from "../assets/orelse.png";

const Clinical = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(1);
  const [activeTab, setActiveTab] = useState("opd");
  const [activeSection, setActiveSection] = useState("consultation");
  const [searchTerm, setSearchTerm] = useState("");

  const patients = {
    opd: [
      { 
        id: 1, 
        token: 101, 
        name: "Ramesh Patil", 
        age: 45, 
        gender: "Male",
        uhid: "UHID-2024-001",
        status: "Waiting", 
        doctor: "Dr. Sharma",
        department: "Cardiology",
        time: "10:30 AM",
        priority: "High",
        lastVisit: "12-Sep-2024",
        allergies: ["Penicillin", "Aspirin"]
      },
      { 
        id: 2, 
        token: 102, 
        name: "Sunita Kulkarni", 
        age: 32, 
        gender: "Female",
        uhid: "UHID-2024-002",
        status: "In Consultation", 
        doctor: "Dr. Sharma",
        department: "Orthopedics",
        time: "10:45 AM",
        priority: "Normal",
        lastVisit: "15-Aug-2024",
        allergies: ["None"]
      },
    ],
    ipd: [
      { 
        id: 3, 
        name: "Amit Joshi", 
        age: 55, 
        gender: "Male",
        uhid: "UHID-2024-003",
        status: "Admitted", 
        doctor: "Dr. Mehta",
        department: "General Medicine",
        ward: "Ward-301",
        bed: "Bed-12",
        admissionDate: "15-Oct-2024",
        diagnosis: "Pneumonia"
      },
      { 
        id: 4, 
        name: "Priya Sharma", 
        age: 28, 
        gender: "Female",
        uhid: "UHID-2024-004",
        status: "ICU", 
        doctor: "Dr. Mehta",
        department: "Pediatrics",
        ward: "ICU-2",
        bed: "Bed-05",
        admissionDate: "14-Oct-2024",
        diagnosis: "Severe Asthma"
      },
    ],
    rehab: [
      { 
        id: 5, 
        name: "Vikram Singh", 
        age: 60, 
        gender: "Male",
        uhid: "UHID-2024-005",
        status: "Active", 
        therapist: "Dr. Desai",
        program: "Cardiac Rehab",
        session: "Session 8/12",
        nextSession: "Tomorrow, 11 AM"
      },
      { 
        id: 6, 
        name: "Meera Reddy", 
        age: 42, 
        gender: "Female",
        uhid: "UHID-2024-006",
        status: "Completed", 
        therapist: "Dr. Desai",
        program: "Post-Stroke Rehab",
        session: "Graduated",
        nextSession: "Follow-up in 1 month"
      },
    ]
  };

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

  const selectedPatientData = patients[activeTab]?.find(p => p.id === selectedPatient);

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
                      setSelectedPatient(patients[tab.id]?.[0]?.id || 1);
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
                    {patients[activeTab]?.length || 0} Patients
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
              {patients[activeTab]?.map((patient) => (
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

            {/* Section Content */}
            <div className="section-content">
              {/* OPD Content */}
              {activeTab === 'opd' && (
                <>
                  {activeSection === 'consultation' && (
                    <div className="opd-consultation">
                      <h3><FaNotesMedical /> OPD Consultation</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Chief Complaint *</label>
                          <textarea placeholder="Patient's primary complaints..." rows="3" />
                        </div>
                        <div className="form-group">
                          <label>History of Present Illness</label>
                          <textarea placeholder="Detailed history..." rows="4" />
                        </div>
                        <div className="form-group">
                          <label>Clinical Examination</label>
                          <textarea placeholder="Physical examination findings..." rows="4" />
                        </div>
                        <div className="form-group">
                          <label>Vital Signs</label>
                          <div className="vitals-grid">
                            <input placeholder="BP (mmHg)" />
                            <input placeholder="Pulse (bpm)" />
                            <input placeholder="Temp (°C)" />
                            <input placeholder="SpO₂ (%)" />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Provisional Diagnosis *</label>
                          <input placeholder="Enter diagnosis..." />
                        </div>
                        <div className="form-group">
                          <label>Investigation Advised</label>
                          <textarea placeholder="Lab tests, radiology..." rows="3" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'prescription' && (
                    <div className="prescription-section">
                      <h3><FaPrescription /> e-Prescription</h3>
                      <div className="prescription-form">
                        <div className="medication-section">
                          <h4>Medications</h4>
                          <div className="medication-table">
                            <div className="med-row header">
                              <div>Medicine</div>
                              <div>Dosage</div>
                              <div>Frequency</div>
                              <div>Duration</div>
                            </div>
                            <div className="med-row">
                              <input placeholder="Medicine name" />
                              <input placeholder="e.g., 500mg" />
                              <input placeholder="e.g., BD" />
                              <input placeholder="e.g., 7 days" />
                            </div>
                          </div>
                          <button className="add-med-btn">+ Add Medicine</button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* IPD Content */}
              {activeTab === 'ipd' && (
                <>
                  {activeSection === 'admission' && (
                    <div className="ipd-admission">
                      <h3><FaRegHospital /> IPD Admission</h3>
                      <div className="ipd-form-grid">
                        <div className="form-group">
                          <label>Admission Date *</label>
                          <input type="date" />
                        </div>
                        <div className="form-group">
                          <label>Select Ward *</label>
                          <select>
                            <option>General Ward</option>
                            <option>ICU</option>
                            <option>Private Room</option>
                            <option>Semi-Private</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Bed Number *</label>
                          <input placeholder="Bed number" />
                        </div>
                        <div className="form-group">
                          <label>Admitting Doctor *</label>
                          <select>
                            <option>Dr. Sharma</option>
                            <option>Dr. Mehta</option>
                            <option>Dr. Desai</option>
                          </select>
                        </div>
                        <div className="form-group full-width">
                          <label>Admission Diagnosis *</label>
                          <textarea placeholder="Primary diagnosis for admission..." rows="3" />
                        </div>
                        <div className="form-group full-width">
                          <label>Admission Notes</label>
                          <textarea placeholder="Additional admission notes..." rows="4" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'progress' && (
                    <div className="ipd-progress">
                      <h3><FaClipboardCheck /> Daily Progress Notes</h3>
                      <div className="progress-container">
                        <div className="progress-form">
                          <div className="form-group">
                            <label>Date & Time</label>
                            <input type="datetime-local" />
                          </div>
                          <div className="form-group">
                            <label>Subjective</label>
                            <textarea placeholder="Patient's complaints..." rows="3" />
                          </div>
                          <div className="form-group">
                            <label>Objective</label>
                            <textarea placeholder="Clinical findings..." rows="3" />
                          </div>
                          <div className="form-group">
                            <label>Assessment</label>
                            <textarea placeholder="Clinical assessment..." rows="3" />
                          </div>
                          <div className="form-group">
                            <label>Plan</label>
                            <textarea placeholder="Treatment plan..." rows="3" />
                          </div>
                          <button className="save-progress-btn">Save Progress Note</button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Rehab Content */}
              {activeTab === 'rehab' && (
                <>
                  {activeSection === 'assessment' && (
                    <div className="rehab-assessment">
                      <h3><FaBrain /> Rehabilitation Assessment</h3>
                      <div className="assessment-grid">
                        <div className="assessment-card">
                          <h4>Initial Assessment</h4>
                          <textarea placeholder="Initial evaluation findings..." rows="6" />
                        </div>
                        <div className="assessment-card">
                          <h4>Functional Assessment</h4>
                          <textarea placeholder="Functional abilities..." rows="6" />
                        </div>
                        <div className="assessment-card">
                          <h4>Goal Setting</h4>
                          <textarea placeholder="Rehabilitation goals..." rows="6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'therapy' && (
                    <div className="rehab-therapy">
                      <h3><FaProcedures /> Therapy Plan</h3>
                      <div className="therapy-plan">
                        <div className="form-group">
                          <label>Therapy Type *</label>
                          <select>
                            <option>Physical Therapy</option>
                            <option>Occupational Therapy</option>
                            <option>Speech Therapy</option>
                            <option>Cardiac Rehab</option>
                            <option>Pulmonary Rehab</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Frequency *</label>
                          <select>
                            <option>Daily</option>
                            <option>3 times/week</option>
                            <option>2 times/week</option>
                            <option>Weekly</option>
                          </select>
                        </div>
                        <div className="form-group full-width">
                          <label>Therapy Plan Details</label>
                          <textarea placeholder="Detailed therapy plan..." rows="6" />
                        </div>
                        <div className="form-group full-width">
                          <label>Equipment Needed</label>
                          <textarea placeholder="Required equipment..." rows="3" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'sessions' && (
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
                        {[
                          { date: "15-Oct-2024", type: "PT", duration: "45 min", therapist: "Dr. Desai", progress: "Good" },
                          { date: "14-Oct-2024", type: "OT", duration: "60 min", therapist: "Dr. Patel", progress: "Excellent" },
                          { date: "12-Oct-2024", type: "PT", duration: "45 min", therapist: "Dr. Desai", progress: "Fair" },
                        ].map((session, index) => (
                          <div key={index} className="session-row">
                            <div>{session.date}</div>
                            <div>{session.type}</div>
                            <div>{session.duration}</div>
                            <div>{session.therapist}</div>
                            <div><span className={`progress-status ${session.progress.toLowerCase()}`}>{session.progress}</span></div>
                          </div>
                        ))}
                      </div>
                      <button className="add-session-btn">+ Schedule New Session</button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              {activeTab === 'opd' && (
                <>
                  <button className="quick-action-btn complete-btn">
                    Complete Consultation
                  </button>
                  <button className="quick-action-btn next-btn">
                    Next Patient
                  </button>
                  <button className="quick-action-btn lab-btn">
                    Send to Lab
                  </button>
                </>
              )}
              {activeTab === 'ipd' && (
                <>
                  <button className="quick-action-btn transfer-btn">
                    Transfer Ward
                  </button>
                  <button className="quick-action-btn procedure-btn">
                    Schedule Procedure
                  </button>
                  <button className="quick-action-btn discharge-btn">
                    Initiate Discharge
                  </button>
                </>
              )}
              {activeTab === 'rehab' && (
                <>
                  <button className="quick-action-btn session-btn">
                    Start Session
                  </button>
                  <button className="quick-action-btn evaluate-btn">
                    Evaluate Progress
                  </button>
                  <button className="quick-action-btn discharge-btn">
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