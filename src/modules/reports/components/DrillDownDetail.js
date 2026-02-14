// Renders a detail table when user drills down from a stat card. Pass columns + rows.
import React from 'react';
import ReportTable from './ReportTable';

const DrillDownDetail = ({ title, columns, rows }) => {
  if (!title || !columns || !rows || rows.length === 0) return null;
  return (
    <div className="drill-down-detail">
      <h5>{title}</h5>
      <ReportTable columns={columns} rows={rows} />
    </div>
  );
};

export default DrillDownDetail;
