// Patient Statistics: new vs returning, gender, age group, OPD vs IPD ratio.
// ReportFilters + ReportExportBar; optional drill-down; mock data.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import StatCard from './components/StatCard';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import './Reports.css';

const MOCK_NEW_RETURNING = [
  { label: 'New Patients', percent: 32, count: 420 },
  { label: 'Returning Patients', percent: 68, count: 892 },
];

const MOCK_GENDER = [
  { label: 'Male', percent: 54 },
  { label: 'Female', percent: 44 },
  { label: 'Other', percent: 2 },
];

const MOCK_AGE_GROUP = [
  { label: '0–18', percent: 22 },
  { label: '19–35', percent: 28 },
  { label: '36–50', percent: 25 },
  { label: '51–65', percent: 18 },
  { label: '65+', percent: 7 },
];

const MOCK_OPD_IPD_RATIO = { opd: 85, ipd: 15 };

const PatientStatisticsReport = () => {
  const [dateFrom, setDateFrom] = useState(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [dateTo, setDateTo] = useState(() => new Date());
  const [department, setDepartment] = useState('');

  return (
    <div className="content-area report-page">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>Patient Statistics Report</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Summary statistics (mock data)
      </p>

      <ReportFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        department={department}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onDepartmentChange={setDepartment}
        showDepartment
      />

      <ReportExportBar />

      <div className="reports-stat-grid">
        <StatCard label="New vs Returning" value="32% / 68%" accent="accent-1" />
        <StatCard label="OPD vs IPD Ratio" value={`${MOCK_OPD_IPD_RATIO.opd}% / ${MOCK_OPD_IPD_RATIO.ipd}%`} accent="accent-2" />
      </div>

      <div className="report-section">
        <h4>New vs Returning Patients</h4>
        <ul className="distribution-list">
          {MOCK_NEW_RETURNING.map((row) => (
            <li key={row.label}>
              <span>{row.label} ({row.count})</span>
              <span className="percent">{row.percent}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h4>Gender Distribution</h4>
        <ul className="distribution-list">
          {MOCK_GENDER.map((row) => (
            <li key={row.label}>
              <span>{row.label}</span>
              <span className="percent">{row.percent}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h4>Age Group Distribution</h4>
        <ul className="distribution-list">
          {MOCK_AGE_GROUP.map((row) => (
            <li key={row.label}>
              <span>{row.label} years</span>
              <span className="percent">{row.percent}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="report-section">
        <h4>OPD vs IPD Ratio</h4>
        <p>
          OPD consultations: <strong>{MOCK_OPD_IPD_RATIO.opd}%</strong> · IPD admissions: <strong>{MOCK_OPD_IPD_RATIO.ipd}%</strong>
        </p>
      </div>
    </div>
  );
};

export default PatientStatisticsReport;
