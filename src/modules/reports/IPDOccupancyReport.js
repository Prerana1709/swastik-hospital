// IPD Occupancy Report: bed occupancy by ward, trends. Filters + drill-down + export (UI only).
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import StatCard from './components/StatCard';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import ReportTable from './components/ReportTable';
import DrillDownDetail from './components/DrillDownDetail';
import './Reports.css';

const MOCK_OCCUPANCY_STATS = {
  overallPercent: 82,
  totalBeds: 75,
  occupiedBeds: 62,
  vacantBeds: 13,
};

const MOCK_OCCUPANCY_BY_WARD = [
  { ward: 'General Ward', total: 50, occupied: 45, vacant: 5, percent: '90%' },
  { ward: 'ICU', total: 10, occupied: 8, vacant: 2, percent: '80%' },
  { ward: 'Private', total: 15, occupied: 9, vacant: 6, percent: '60%' },
];

const MOCK_OCCUPANCY_DAILY = [
  { date: '01-Nov-2024', occupied: 58, total: 75, percent: '77%' },
  { date: '02-Nov-2024', occupied: 61, total: 75, percent: '81%' },
  { date: '03-Nov-2024', occupied: 62, total: 75, percent: '83%' },
  { date: '04-Nov-2024', occupied: 60, total: 75, percent: '80%' },
  { date: '05-Nov-2024', occupied: 62, total: 75, percent: '83%' },
];

const WARD_COLUMNS = [
  { key: 'ward', label: 'Ward' },
  { key: 'total', label: 'Total beds' },
  { key: 'occupied', label: 'Occupied' },
  { key: 'vacant', label: 'Vacant' },
  { key: 'percent', label: 'Occupancy %' },
];
const DAILY_COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'occupied', label: 'Occupied' },
  { key: 'total', label: 'Total' },
  { key: 'percent', label: 'Occupancy %' },
];

const IPDOccupancyReport = () => {
  const [dateFrom, setDateFrom] = useState(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [dateTo, setDateTo] = useState(() => new Date());
  const [department, setDepartment] = useState('');
  const [drillDown, setDrillDown] = useState(null);

  return (
    <div className="content-area report-page">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>IPD Occupancy Report</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Bed occupancy by ward and over time (mock data)
      </p>

      <ReportFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        department={department}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onDepartmentChange={setDepartment}
        showDepartment={false}
      />

      <ReportExportBar />

      <div className="reports-stat-grid">
        <StatCard
          label="Overall occupancy"
          value={MOCK_OCCUPANCY_STATS.overallPercent + '%'}
          accent="accent-1"
          onClick={() => setDrillDown({ title: 'Occupancy by ward', columns: WARD_COLUMNS, rows: MOCK_OCCUPANCY_BY_WARD })}
          drillHint="Click to view by ward"
        />
        <StatCard label="Total beds" value={MOCK_OCCUPANCY_STATS.totalBeds} accent="accent-2" />
        <StatCard label="Occupied" value={MOCK_OCCUPANCY_STATS.occupiedBeds} accent="accent-3" />
        <StatCard label="Vacant" value={MOCK_OCCUPANCY_STATS.vacantBeds} accent="accent-5" />
      </div>

      <div className="report-section">
        <h4>Occupancy by ward</h4>
        <ReportTable columns={WARD_COLUMNS} rows={MOCK_OCCUPANCY_BY_WARD} />
      </div>

      <div className="report-section">
        <h4>Daily occupancy (last 7 days)</h4>
        <ReportTable columns={DAILY_COLUMNS} rows={MOCK_OCCUPANCY_DAILY} />
      </div>

      {drillDown && (
        <div className="report-section">
          <DrillDownDetail title={drillDown.title} columns={drillDown.columns} rows={drillDown.rows} />
        </div>
      )}
    </div>
  );
};

export default IPDOccupancyReport;
