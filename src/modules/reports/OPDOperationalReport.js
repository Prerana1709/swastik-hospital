// OPD Operational Report: visits by time/department, wait times, throughput. Filters + drill-down + export (UI only).
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import StatCard from './components/StatCard';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import ReportTable from './components/ReportTable';
import DrillDownDetail from './components/DrillDownDetail';
import './Reports.css';

const MOCK_OPD_STATS = {
  totalVisits: 312,
  avgWaitMins: 18,
  peakHour: '10:00–11:00',
  consultationsCompleted: 298,
};

const MOCK_VISITS_BY_DEPT = [
  { department: 'General Medicine', visits: 98, avgWait: '22 min' },
  { department: 'Cardiology', visits: 56, avgWait: '25 min' },
  { department: 'Orthopedics', visits: 48, avgWait: '15 min' },
  { department: 'Pediatrics', visits: 52, avgWait: '12 min' },
  { department: 'Neurology', visits: 42, avgWait: '20 min' },
];

const MOCK_VISITS_BY_HOUR = [
  { slot: '08:00–09:00', visits: 28 },
  { slot: '09:00–10:00', visits: 45 },
  { slot: '10:00–11:00', visits: 62 },
  { slot: '11:00–12:00', visits: 48 },
  { slot: '12:00–13:00', visits: 35 },
  { slot: '14:00–15:00', visits: 38 },
  { slot: '15:00–16:00', visits: 36 },
];

const DEPT_COLUMNS = [
  { key: 'department', label: 'Department' },
  { key: 'visits', label: 'Visits' },
  { key: 'avgWait', label: 'Avg wait' },
];
const HOUR_COLUMNS = [
  { key: 'slot', label: 'Time slot' },
  { key: 'visits', label: 'Visits' },
];

const OPDOperationalReport = () => {
  const [dateFrom, setDateFrom] = useState(() => new Date());
  const [dateTo, setDateTo] = useState(() => new Date());
  const [department, setDepartment] = useState('');
  const [drillDown, setDrillDown] = useState(null);

  return (
    <div className="content-area report-page">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>OPD Operational Report</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Visits, wait times, and throughput by department (mock data)
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
          label="Total OPD Visits"
          value={MOCK_OPD_STATS.totalVisits}
          accent="accent-1"
          onClick={() => setDrillDown({ title: 'Visits by department', columns: DEPT_COLUMNS, rows: MOCK_VISITS_BY_DEPT })}
          drillHint="Click to view by department"
        />
        <StatCard label="Avg wait time" value={MOCK_OPD_STATS.avgWaitMins + ' min'} accent="accent-2" />
        <StatCard
          label="Peak hour"
          value={MOCK_OPD_STATS.peakHour}
          accent="accent-3"
          onClick={() => setDrillDown({ title: 'Visits by time slot', columns: HOUR_COLUMNS, rows: MOCK_VISITS_BY_HOUR })}
          drillHint="Click to view by slot"
        />
        <StatCard label="Consultations completed" value={MOCK_OPD_STATS.consultationsCompleted} accent="accent-5" />
      </div>

      <div className="report-section">
        <h4>Visits by department</h4>
        <ReportTable columns={DEPT_COLUMNS} rows={MOCK_VISITS_BY_DEPT} />
      </div>

      <div className="report-section">
        <h4>Visits by time slot</h4>
        <ReportTable columns={HOUR_COLUMNS} rows={MOCK_VISITS_BY_HOUR} />
      </div>

      {drillDown && (
        <div className="report-section">
          <DrillDownDetail title={drillDown.title} columns={drillDown.columns} rows={drillDown.rows} />
        </div>
      )}
    </div>
  );
};

export default OPDOperationalReport;
