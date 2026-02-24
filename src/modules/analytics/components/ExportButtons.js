// Export CSV and PDF (mock). Ready for backend integration.
import React from "react";

function ExportButtons() {
  const handleCSV = () => {
    alert("Export CSV – will integrate with backend to download current view data.");
  };
  const handlePDF = () => {
    alert("Download PDF – will integrate with backend to generate report PDF.");
  };
  return (
    <div className="analytics-export-buttons">
      <button type="button" className="analytics-export-btn csv" onClick={handleCSV}>Export CSV</button>
      <button type="button" className="analytics-export-btn pdf" onClick={handlePDF}>Download PDF</button>
    </div>
  );
}

export default ExportButtons;
