// Chart card wrapper with optional title and insight text.
import React from "react";

function ChartsSection({ title, children, insight }) {
  return (
    <div className="analytics-chart-card">
      {title && <h4 className="analytics-chart-title">{title}</h4>}
      <div className="analytics-chart-body">{children}</div>
      {insight && <p className="analytics-chart-insight">{insight}</p>}
    </div>
  );
}

export default ChartsSection;
