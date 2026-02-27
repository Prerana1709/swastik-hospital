// Reusable KPI card for analytics. Theme: #2f6f6c.
import React from "react";

function KPIBox({ title, value, subtitle, accent }) {
  return (
    <div className={`analytics-kpi-box ${accent ? `accent-${accent}` : ""}`}>
      <div className="analytics-kpi-label">{title}</div>
      <div className="analytics-kpi-value">{value}</div>
      {subtitle && <div className="analytics-kpi-subtitle">{subtitle}</div>}
    </div>
  );
}

export default KPIBox;
