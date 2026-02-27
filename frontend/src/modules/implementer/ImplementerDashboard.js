// Psychiatric System Configuration – main dashboard with 7 config cards.
import React from "react";
import { Link } from "react-router-dom";
import {
  FaBuilding,
  FaFileMedical,
  FaChartLine,
  FaExclamationTriangle,
  FaHandHoldingHeart,
  FaProcedures,
  FaPills,
} from "react-icons/fa";
import "./implementer.css";

const PSYCH_CONFIG_CARDS = [
  {
    id: "psych-departments",
    label: "Psychiatric Department Configuration",
    path: "/implementer/psych-departments",
    icon: <FaBuilding />,
    description: "Adult Psychiatry, Child Psychiatry, De-addiction, Rehab, Emergency Psychiatry, ECT Unit",
  },
  {
    id: "clinical-forms",
    label: "Psychiatric Clinical Form Builder",
    path: "/implementer/clinical-forms",
    icon: <FaFileMedical />,
    description: "MSE, Suicide Risk, Violence Risk, DSM-5, Progress Notes, Therapy Session templates",
  },
  {
    id: "scales-assessment",
    label: "Psychiatric Scales & Assessment Tools",
    path: "/implementer/scales-assessment",
    icon: <FaChartLine />,
    description: "PHQ-9, GAD-7, HAM-D, YMRS, MMSE, BPRS – scoring and severity interpretation",
  },
  {
    id: "risk-safety",
    label: "Risk & Safety Configuration",
    path: "/implementer/risk-safety",
    icon: <FaExclamationTriangle />,
    description: "Suicide alert threshold, high risk flags, emergency protocol, guardian notification",
  },
  {
    id: "therapy-rehab",
    label: "Therapy & Rehabilitation Settings",
    path: "/implementer/therapy-rehab",
    icon: <FaHandHoldingHeart />,
    description: "CBT/DBT setup, group therapy, session frequency, rehab milestone tracking",
  },
  {
    id: "ipd-ward",
    label: "Psychiatric IPD Ward Configuration",
    path: "/implementer/ipd-ward",
    icon: <FaProcedures />,
    description: "Open/Closed/Observation wards, ECT scheduling, restraint policy",
  },
  {
    id: "medication-monitoring",
    label: "Psychiatric Medication Monitoring",
    path: "/implementer/medication-monitoring",
    icon: <FaPills />,
    description: "Lithium & Clozapine monitoring, antipsychotic side-effect tracking, lab frequency",
  },
];

function ImplementerDashboard() {
  return (
    <div className="content-area impl-page">
      <h2>Configuration Panel</h2>
      <p className="section-subtitle">
        Configure psychiatric departments, clinical forms, scales, risk protocols, therapy programs, IPD wards, and medication monitoring
      </p>

      <div className="impl-config-grid impl-config-grid-psych">
        {PSYCH_CONFIG_CARDS.map((card) => (
          <Link key={card.id} to={card.path} className="impl-config-card impl-config-card-psych">
            <span className="impl-config-icon">{card.icon}</span>
            <span className="impl-config-label">{card.label}</span>
            <span className="impl-config-desc">{card.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ImplementerDashboard;
