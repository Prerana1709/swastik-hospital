// Daily Summary Report: OPD visits, IPD admissions, discharges, bed occupancy, daily revenue.
// Supports filters, drill-down from stats to detail tables, and export (UI only).
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import StatCard from './components/StatCard';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import DrillDownDetail from './components/DrillDownDetail';
import './Reports.css';

const MOCK_DAILY = {
  opdVisits: 127,
  ipdAdmissions: 8,
  discharges: 6,
  bedOccupancyPercent: 78,
  dailyRevenue: '₹2,45,600',
};

// Mock detail rows for drill-down (audit-style)
const MOCK_OPD_VISITS_ROWS = [
  { time: '09:00', token: 101, patient: 'Ramesh Patil', department: 'Cardiology', doctor: 'Dr. Sharma' },
  { time: '09:15', token: 102, patient: 'Sunita Kulkarni', department: 'Orthopedics', doctor: 'Dr. Desai' },
  { time: '09:30', token: 103, patient: 'Amit Joshi', department: 'General Medicine', doctor: 'Dr. Mehta' },
  { time: '10:00', token: 104, patient: 'Priya Sharma', department: 'Pediatrics', doctor: 'Dr. Patel' },
  { time: '10:30', token: 105, patient: 'Vikram Singh', department: 'Cardiology', doctor: 'Dr. Sharma' },
];
const MOCK_IPD_ADMISSIONS_ROWS = [
  { time: '08:45', patient: 'Rajesh Kumar', ward: 'General Ward', bed: '12', doctor: 'Dr. Mehta' },
  { time: '11:20', patient: 'Anita Desai', ward: 'ICU', bed: '05', doctor: 'Dr. Sharma' },
];
const MOCK_DISCHARGES_ROWS = [
  { time: '10:00', patient: 'Suresh Nair', ward: 'General Ward', diagnosis: 'Pneumonia', status: 'Discharged' },
  { time: '14:00', patient: 'Kavita Rao', ward: 'Private', diagnosis: 'Post-op recovery', status: 'Discharged' },
];

const OPD_DRILL_COLUMNS = [
  { key: 'time', label: 'Time' },
  { key: 'token', label: 'Token' },
  { key: 'patient', label: 'Patient' },
  { key: 'department', label: 'Department' },
  { key: 'doctor', label: 'Doctor' },
];
const IPD_DRILL_COLUMNS = [
  { key: 'time', label: 'Time' },
  { key: 'patient', label: 'Patient' },
  { key: 'ward', label: 'Ward' },
  { key: 'bed', label: 'Bed' },
  { key: 'doctor', label: 'Doctor' },
];
const DISCHARGE_DRILL_COLUMNS = [
  { key: 'time', label: 'Time' },
  { key: 'patient', label: 'Patient' },
  { key: 'ward', label: 'Ward' },
  { key: 'diagnosis', label: 'Diagnosis' },
  { key: 'status', label: 'Status' },
];

const DailySummaryReport = () => {
  const [dateFrom, setDateFrom] = useState(() => new Date());
  const [dateTo, setDateTo] = useState(() => new Date());
  const [department, setDepartment] = useState('');
  const [drillDown, setDrillDown] = useState(null);

  const drillConfig = useMemo(() => ({
    opd: { title: 'OPD visits – detail', columns: OPD_DRILL_COLUMNS, rows: MOCK_OPD_VISITS_ROWS },
    ipd: { title: 'IPD admissions – detail', columns: IPD_DRILL_COLUMNS, rows: MOCK_IPD_ADMISSIONS_ROWS },
    discharges: { title: 'Discharges – detail', columns: DISCHARGE_DRILL_COLUMNS, rows: MOCK_DISCHARGES_ROWS },
  }), []);

  return (
    <div className="content-area report-page">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>Daily Summary Report</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        {dateFrom && dateTo && (
          <>
            {new Date(dateFrom).toLocaleDateString('en-IN')} – {new Date(dateTo).toLocaleDateString('en-IN')}
            {department && ' · '}
            {department && 'Filtered by department'}
          </>
        )}
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
        <StatCard
          label="Total OPD Visits (Today)"
          value={MOCK_DAILY.opdVisits}
          accent="accent-1"
          onClick={() => setDrillDown(drillConfig.opd)}
          drillHint="Click to view detail"
        />
        <StatCard
          label="IPD Admissions"
          value={MOCK_DAILY.ipdAdmissions}
          accent="accent-2"
          onClick={() => setDrillDown(drillConfig.ipd)}
          drillHint="Click to view detail"
        />
        <StatCard
          label="Discharges"
          value={MOCK_DAILY.discharges}
          accent="accent-3"
          onClick={() => setDrillDown(drillConfig.discharges)}
          drillHint="Click to view detail"
        />
        <StatCard label="Bed Occupancy %" value={`${MOCK_DAILY.bedOccupancyPercent}%`} accent="accent-4" />
        <StatCard label="Daily Revenue" value={MOCK_DAILY.dailyRevenue} accent="accent-5" />
      </div>

      {drillDown && (
        <div className="report-section">
          <DrillDownDetail
            title={drillDown.title}
            columns={drillDown.columns}
            rows={drillDown.rows}
          />
        </div>
      )}
    </div>
  );
};

export default DailySummaryReport;
