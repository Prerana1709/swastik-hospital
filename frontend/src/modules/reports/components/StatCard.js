// Reusable stat card; optional drill-down (onClick + hint).
import React from 'react';

const StatCard = ({ label, value, accent = 'accent-1', onClick, drillHint }) => (
  <div
    className={`report-stat-card ${accent} ${onClick ? 'clickable' : ''}`}
    onClick={onClick}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    <div className="label">{label}</div>
    <div className="value">{value}</div>
    {drillHint && <div className="drill-hint">{drillHint}</div>}
  </div>
);

export default StatCard;
