// Reports & Analytics – Psychiatric Hospital focus. Six modules; each opens a detailed report.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBrain,
  FaChartLine,
  FaHandHoldingHeart,
  FaProcedures,
  FaPills,
  FaExclamationTriangle,
  FaFileMedical,
} from 'react-icons/fa';
import ReportFilters from './components/ReportFilters';
import './Reports.css';

const PSYCH_MODULES = [
  {
    id: 'mental-health',
    label: 'Mental Health Overview',
    path: '/reports/mental-health',
    icon: <FaBrain />,
    description: 'Active patients, suicide risk, depression & anxiety severity, emergency admissions',
  },
  {
    id: 'psychological-scales',
    label: 'Psychological Scale Analytics',
    path: '/reports/psychological-scales',
    icon: <FaChartLine />,
    description: 'PHQ-9, GAD-7, MSE, cognitive function trends',
  },
  {
    id: 'therapy-rehab',
    label: 'Therapy & Rehabilitation Analytics',
    path: '/reports/therapy-rehab',
    icon: <FaHandHoldingHeart />,
    description: 'Sessions completed, improvement %, completion & dropout rates',
  },
  {
    id: 'psychiatric-ipd',
    label: 'Psychiatric IPD Analytics',
    path: '/reports/psychiatric-ipd',
    icon: <FaProcedures />,
    description: 'Length of stay, crisis interventions, readmissions, ward occupancy',
  },
  {
    id: 'medication-compliance',
    label: 'Medication Compliance Analytics',
    path: '/reports/medication-compliance',
    icon: <FaPills />,
    description: 'Antidepressants, antipsychotics, mood stabilizers, missed follow-ups',
  },
  {
    id: 'risk-safety',
    label: 'Risk & Safety Monitoring',
    path: '/reports/risk-safety',
    icon: <FaExclamationTriangle />,
    description: 'Self-harm risk, violence risk, emergency referrals, crisis alerts',
  },
  {
    id: 'patient-records',
    label: 'Psychiatric Patient Records',
    path: '/reports/patient-records',
    icon: <FaFileMedical />,
    description: 'UHID-based search, patient profile, clinical document management (Add/Remove)',
  },
];

const ReportsDashboard = () => {
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  });
  const [dateTo, setDateTo] = useState(new Date());
  const [doctor, setDoctor] = useState('');
  const [programType, setProgramType] = useState('');

  return (
    <div className="content-area reports-dashboard reports-dashboard-psych">
      <section className="reports-dashboard-filters" aria-label="Report filters">
        <ReportFilters
          dateFrom={dateFrom}
          dateTo={dateTo}
          doctor={doctor}
          programType={programType}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onDoctorChange={setDoctor}
          onProgramTypeChange={setProgramType}
          showDepartment={false}
          showDoctor
          showProgramType
        />
      </section>

      <div className="reports-dashboard-scroll">
        <div className="reports-grid reports-grid-psych">
          {PSYCH_MODULES.map((card) => (
            <Link
              key={card.id}
              to={card.path}
              className="report-card report-card-link psych-module-card"
            >
              <span className="psych-module-icon">{card.icon}</span>
              <span className="psych-module-label">{card.label}</span>
              <span className="psych-module-desc">{card.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
