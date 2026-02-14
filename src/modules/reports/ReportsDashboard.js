// Reports landing: four clickable cards; each navigates to its detailed report.
import React from 'react';
import { Link } from 'react-router-dom';
import './Reports.css';

const reportCards = [
  { id: 'daily', label: 'Daily Summary', path: '/reports/daily' },
  { id: 'monthly', label: 'Monthly Analytics', path: '/reports/monthly' },
  { id: 'patients', label: 'Patient Statistics', path: '/reports/patients' },
  { id: 'finance', label: 'Financial Reports', path: '/reports/finance' },
  { id: 'opd-operational', label: 'OPD Operational', path: '/reports/opd-operational' },
  { id: 'ipd-occupancy', label: 'IPD Occupancy', path: '/reports/ipd-occupancy' },
  { id: 'staff-performance', label: 'Staff Performance', path: '/reports/staff-performance' },
];

const ReportsDashboard = () => {
  return (
    <div className="content-area reports-dashboard">
      <div className="reports-grid">
        {reportCards.map((card) => (
          <Link
            key={card.id}
            to={card.path}
            className="report-card report-card-link"
          >
            {card.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReportsDashboard;
