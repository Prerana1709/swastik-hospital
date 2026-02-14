// Reusable export actions: CSV, PDF, Print (UI only – no actual file generation).
import React from 'react';
import { FaFileCsv, FaFilePdf, FaPrint } from 'react-icons/fa';

const ReportExportBar = ({ onExportCSV, onExportPDF, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  return (
    <div className="report-export-bar">
      <span className="report-export-label">Export / actions:</span>
      <div className="report-actions">
        <button type="button" className="export-btn csv" onClick={onExportCSV || (() => {})}>
          <FaFileCsv /> CSV
        </button>
        <button type="button" className="export-btn pdf" onClick={onExportPDF || (() => {})}>
          <FaFilePdf /> PDF
        </button>
        <button type="button" className="export-btn print" onClick={handlePrint}>
          <FaPrint /> Print
        </button>
      </div>
    </div>
  );
};

export default ReportExportBar;
