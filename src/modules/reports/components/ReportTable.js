// Reusable table for report data (no chart library).
import React from 'react';

const ReportTable = ({ columns, rows }) => (
  <table className="report-table">
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.key}>{col.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, idx) => (
        <tr key={idx}>
          {columns.map((col) => (
            <td key={col.key}>{row[col.key]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default ReportTable;
