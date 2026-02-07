import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Registration.css";

import swastikLogo from "../assets/swastiklogo.png";
// import orelseLogo from "../assets/orelse.png";

function Registration() {
  const navigate = useNavigate();

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
              <h1>Swastik Hospital</h1>
              <p className="hospital-tagline">
                Digital Healthcare Management System
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">
        <div className="content-area">
          <h2>Registration</h2>
          <p className="section-subtitle">
            Select a registration category
          </p>

          <div className="registration-grid">
            <div className="registration-card">
              <h3>Patient Registration</h3>
              <p>Register new patients and generate UHID</p>
              <button>Open</button>
            </div>

            <div className="registration-card">
              <h3>Doctor Registration</h3>
              <p>Add doctors and assign departments</p>
              <button>Open</button>
            </div>

            <div className="registration-card">
              <h3>Staff Registration</h3>
              <p>Register nurses, reception and admin staff</p>
              <button>Open</button>
            </div>

            <div className="registration-card">
              <h3>OPD Registration</h3>
              <p>Outpatient department registration</p>
              <button>Open</button>
            </div>

            <div className="registration-card">
              <h3>IPD Admission</h3>
              <p>Inpatient admission and bed allocation</p>
              <button>Open</button>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p className="copyright">
              © {new Date().getFullYear()} Swastik Hospital. All rights reserved. | Developed and managed by ORELSE Private Limited.
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
}

export default Registration;
