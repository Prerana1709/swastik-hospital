// Financial Reports: OPD, IPD, Lab, Pharmacy, Total revenue.
// ReportFilters + ReportExportBar (CSV, PDF, Print – UI only).
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import StatCard from './components/StatCard';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import './Reports.css';

const MOCK_REVENUE = {
  opd: '₹8,42,000',
  ipd: '₹12,65,000',
  lab: '₹2,18,000',
  pharmacy: '₹3,45,000',
  total: '₹26,70,000',
};

const FinancialReports = () => {
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
      <h3>Financial Reports</h3>
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

      <div className="reports-stat-grid">
        <StatCard label="OPD Revenue" value={MOCK_REVENUE.opd} accent="accent-1" />
        <StatCard label="IPD Revenue" value={MOCK_REVENUE.ipd} accent="accent-2" />
        <StatCard label="Lab Revenue" value={MOCK_REVENUE.lab} accent="accent-3" />
        <StatCard label="Pharmacy Revenue" value={MOCK_REVENUE.pharmacy} accent="accent-4" />
        <StatCard label="Total Revenue" value={MOCK_REVENUE.total} accent="accent-5" />
      </div>
    </div>
  );
};

export default FinancialReports;
