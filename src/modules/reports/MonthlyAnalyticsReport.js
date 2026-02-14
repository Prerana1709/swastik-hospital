// Monthly Analytics: OPD by department, IPD occupancy, doctor-wise consultations.
// ReportFilters + ReportExportBar; mock data.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ReportTable from './components/ReportTable';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import './Reports.css';

const MOCK_OPD_BY_DEPT = [
  { department: 'General Medicine', count: 420 },
  { department: 'Cardiology', count: 185 },
  { department: 'Orthopedics', count: 210 },
  { department: 'Pediatrics', count: 165 },
  { department: 'Neurology', count: 98 },
];

const MOCK_IPD_OVERVIEW = [
  { ward: 'General Ward', occupied: 45, total: 50, percent: '90%' },
  { ward: 'ICU', occupied: 8, total: 10, percent: '80%' },
  { ward: 'Private', occupied: 12, total: 15, percent: '80%' },
];

const MOCK_DOCTOR_CONSULTS = [
  { doctor: 'Dr. Sharma', department: 'Cardiology', consultations: 156 },
  { doctor: 'Dr. Mehta', department: 'General Medicine', consultations: 212 },
  { doctor: 'Dr. Desai', department: 'Orthopedics', consultations: 134 },
  { doctor: 'Dr. Patel', department: 'Pediatrics', consultations: 98 },
];

const OPD_COLUMNS = [
  { key: 'department', label: 'Department' },
  { key: 'count', label: 'OPD Count' },
];
const IPD_COLUMNS = [
  { key: 'ward', label: 'Ward' },
  { key: 'occupied', label: 'Occupied' },
  { key: 'total', label: 'Total Beds' },
  { key: 'percent', label: 'Occupancy %' },
];
const DOC_COLUMNS = [
  { key: 'doctor', label: 'Doctor' },
  { key: 'department', label: 'Department' },
  { key: 'consultations', label: 'Consultations' },
];

const MonthlyAnalyticsReport = () => {
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [dateTo, setDateTo] = useState(() => new Date());
  const [department, setDepartment] = useState('');

  return (
    <div className="content-area report-page">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>Monthly Analytics Report</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
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

      <div className="report-section">
        <h4>OPD Count by Department</h4>
        <ReportTable columns={OPD_COLUMNS} rows={MOCK_OPD_BY_DEPT} />
      </div>

      <div className="report-section">
        <h4>IPD Occupancy Overview</h4>
        <ReportTable columns={IPD_COLUMNS} rows={MOCK_IPD_OVERVIEW} />
      </div>

      <div className="report-section">
        <h4>Doctor-wise Consultation Counts</h4>
        <ReportTable columns={DOC_COLUMNS} rows={MOCK_DOCTOR_CONSULTS} />
      </div>
    </div>
  );
};

export default MonthlyAnalyticsReport;
