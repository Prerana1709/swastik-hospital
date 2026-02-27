// Staff Performance Report: consultations, procedures, by staff/role. Filters + drill-down + export (UI only).
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import StatCard from './components/StatCard';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import ReportTable from './components/ReportTable';
import DrillDownDetail from './components/DrillDownDetail';
import './Reports.css';

const MOCK_STAFF_STATS = {
  totalConsultations: 1248,
  totalProcedures: 186,
  avgPerDoctor: 156,
  topPerformer: 'Dr. Mehta',
};

const MOCK_DOCTOR_PERF = [
  { staff: 'Dr. Sharma', role: 'Consultant', department: 'Cardiology', consultations: 212, procedures: 28 },
  { staff: 'Dr. Mehta', role: 'Consultant', department: 'General Medicine', consultations: 268, procedures: 32 },
  { staff: 'Dr. Desai', role: 'Consultant', department: 'Orthopedics', consultations: 198, procedures: 45 },
  { staff: 'Dr. Patel', role: 'Consultant', department: 'Pediatrics', consultations: 186, procedures: 22 },
  { staff: 'Dr. Reddy', role: 'Senior Resident', department: 'Neurology', consultations: 124, procedures: 18 },
];

const MOCK_NURSE_ACTIVITY = [
  { staff: 'Sister Anitha', ward: 'General Ward', procedures: 45, patientDays: 120 },
  { staff: 'Sister Kavita', ward: 'ICU', procedures: 28, patientDays: 85 },
  { staff: 'Brother Ramesh', ward: 'General Ward', procedures: 38, patientDays: 110 },
];

const DOC_COLUMNS = [
  { key: 'staff', label: 'Staff' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'consultations', label: 'Consultations' },
  { key: 'procedures', label: 'Procedures' },
];
const NURSE_COLUMNS = [
  { key: 'staff', label: 'Staff' },
  { key: 'ward', label: 'Ward' },
  { key: 'procedures', label: 'Procedures' },
  { key: 'patientDays', label: 'Patient-days' },
];

const StaffPerformanceReport = () => {
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [dateTo, setDateTo] = useState(() => new Date());
  const [department, setDepartment] = useState('');
  const [drillDown, setDrillDown] = useState(null);

  return (
    <div className="content-area report-page">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>Staff Performance Report</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Consultations and procedures by staff (mock data)
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
          label="Total consultations"
          value={MOCK_STAFF_STATS.totalConsultations}
          accent="accent-1"
          onClick={() => setDrillDown({ title: 'Doctor-wise performance', columns: DOC_COLUMNS, rows: MOCK_DOCTOR_PERF })}
          drillHint="Click to view by doctor"
        />
        <StatCard label="Total procedures" value={MOCK_STAFF_STATS.totalProcedures} accent="accent-2" />
        <StatCard label="Avg per doctor" value={MOCK_STAFF_STATS.avgPerDoctor} accent="accent-3" />
        <StatCard
          label="Top performer"
          value={MOCK_STAFF_STATS.topPerformer}
          accent="accent-5"
          onClick={() => setDrillDown({ title: 'Nursing activity', columns: NURSE_COLUMNS, rows: MOCK_NURSE_ACTIVITY })}
          drillHint="Click for nursing summary"
        />
      </div>

      <div className="report-section">
        <h4>Doctor-wise performance</h4>
        <ReportTable columns={DOC_COLUMNS} rows={MOCK_DOCTOR_PERF} />
      </div>

      <div className="report-section">
        <h4>Nursing activity</h4>
        <ReportTable columns={NURSE_COLUMNS} rows={MOCK_NURSE_ACTIVITY} />
      </div>

      {drillDown && (
        <div className="report-section">
          <DrillDownDetail title={drillDown.title} columns={drillDown.columns} rows={drillDown.rows} />
        </div>
      )}
    </div>
  );
};

export default StaffPerformanceReport;
