// Dashboard module; moved from pages/ (Bahmni-style modules). Behavior unchanged.
import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import {
  FaUserPlus,
  FaStethoscope,
  FaChartBar,
  FaCogs,
  FaFlask,
  FaUserShield,
  FaFileMedical,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

import swastikLogo from '../../assets/swastiklogo.png';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('registration');
  const navigate = useNavigate();

  const menuItems = [
    { id: 'registration', label: 'Registration', icon: <FaUserPlus /> },
    { id: 'clinical', label: 'Clinical', icon: <FaStethoscope /> },
    { id: 'reports', label: 'Reports', icon: <FaChartBar /> },
    { id: 'implementer', label: 'Implementer Interface', icon: <FaCogs /> },
    { id: 'lab', label: 'Lab Entry', icon: <FaFlask /> },
    { id: 'admin', label: 'Admin', icon: <FaUserShield /> },
    { id: 'patient-docs', label: 'Patient Documents', icon: <FaFileMedical /> },
    { id: 'appointment', label: 'Appointment Scheduling', icon: <FaCalendarAlt /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'registration':
        return (
          <div className="content-area">
            <h2>Patient Registration</h2>
            <div className="registration-form">
              <div className="form-row">
                <input type="text" placeholder="Patient Name" />
                <input type="text" placeholder="Phone Number" />
              </div>
              <div className="form-row">
                <input type="text" placeholder="Age" />
                <select>
                  <option>Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-row">
                <textarea placeholder="Address" rows="3"></textarea>
              </div>
              <button
                className="submit-btn"
                onClick={() => navigate('/registration')}
              >
                Register Patient
              </button>
            </div>
          </div>
        );
      case 'clinical':
        return (
          <div className="content-area">
            <h2>Clinical Management</h2>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Active Patients</h3>
                <p className="stat-number">24</p>
              </div>

              <div className="stat-card">
                <h3>Today's Appointments</h3>
                <p className="stat-number">8</p>
              </div>

              <div className="stat-card">
                <h3>Pending Prescriptions</h3>
                <p className="stat-number">12</p>
              </div>
            </div>

            {/* OPEN CLINICAL PAGE BUTTON */}
            <div style={{ marginTop: "20px" }}>
              <button
                className="open-clinical-btn"
                onClick={() => navigate("/clinical")}
              >
                Open Clinical Workspace
              </button>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="content-area">
            <h2>Reports & Analytics</h2>
            <div className="reports-grid">
              <div className="report-card">Daily Summary</div>
              <div className="report-card">Monthly Analytics</div>
              <div className="report-card">Patient Statistics</div>
              <div className="report-card">Financial Reports</div>
            </div>
          </div>
        );
      case 'appointment':
        return (
          <div className="content-area">
            <h2>Appointment Scheduling</h2>
            <div className="appointment-container">
              <div className="appointment-form">
                <h3>Schedule New Appointment</h3>
                <div className="form-row">
                  <input type="text" placeholder="Patient Name" />
                  <input type="text" placeholder="Phone Number" />
                </div>
                <div className="form-row">
                  <input type="date" placeholder="Date" />
                  <input type="time" placeholder="Time" />
                </div>
                <div className="form-row">
                  <select>
                    <option>Select Doctor</option>
                    <option>Dr. Rajesh Kumar</option>
                    <option>Dr. Priya Sharma</option>
                    <option>Dr. Amit Patel</option>
                  </select>
                  <select>
                    <option>Department</option>
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Neurology</option>
                  </select>
                </div>
                <button className="submit-btn">Schedule Appointment</button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="content-area">
            <h2>{menuItems.find(item => item.id === activeTab)?.label}</h2>
            <p>Content for {menuItems.find(item => item.id === activeTab)?.label} section</p>
            <div className="placeholder-content">
              <p>This section is under development. Detailed functionality will be added soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Top Header with Swastik Logo */}
      <header className="dashboard-header">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="header-left">
          <div className="logo-title-container">
            <img src={swastikLogo} alt="Swastik Hospital" className="header-logo" />
            <div className="header-text">
              <h1>Swastik Hospital</h1>
              <p className="hospital-tagline">Digital Healthcare Management System</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">Dr. Rajesh Kumar</span>
            <span className="user-role">Senior Consultant</span>
          </div>
          <button className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  if (item.id === 'reports') {
                    navigate('/reports');
                    return;
                  }
                  if (item.id === 'lab') {
                    navigate('/lab');
                    return;
                  }
                  if (item.id === 'implementer') {
                    navigate('/implementer');
                    return;
                  }
                  if (item.id === 'admin') {
                    navigate('/admin');
                    return;
                  }
                  if (item.id === 'patient-docs') {
                    navigate('/patient-documents');
                    return;
                  }
                  if (item.id === 'appointment') {
                    navigate('/appointments');
                    return;
                  }
                  setActiveTab(item.id);
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {sidebarOpen && (
                  <span className="sidebar-label">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {sidebarOpen && (
            <div className="sidebar-footer">
              <div className="hospital-info">
                <h4>Swastik Hospital</h4>
                <p>24/7 Emergency Services</p>
                <p>📞 1800-123-4567</p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
          <div className="content-header">
            <h2>
              <span className="content-icon">
                {menuItems.find(item => item.id === activeTab)?.icon}
              </span>
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
            <div className="date-display">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {renderContent()}

          {/* Footer with Orelse Logo */}
          <footer className="dashboard-footer">
            <div className="footer-content">
              <div className="footer-left">
                <p className="copyright">
                  © {new Date().getFullYear()} Swastik Hospital. All rights reserved. | Developed and managed by ORELSE Private Limited.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
