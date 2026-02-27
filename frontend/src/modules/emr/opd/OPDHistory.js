import React, { useState, useEffect } from "react";
import { FaHistory, FaFileAlt, FaPrescription } from "react-icons/fa";
import { api } from "../../../api/service";

function OPDHistory({ patientData }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (patientData?.uhid) {
            api.getClinicalHistory(patientData.uhid)
                .then(setHistory)
                .finally(() => setLoading(false));
        }
    }, [patientData]);

    if (loading) return <div>Loading history...</div>;

    return (
        <div className="opd-history">
            <h3><FaHistory /> Clinical History - {patientData?.name}</h3>
            <div className="history-timeline">
                {history.length === 0 ? (
                    <div className="no-history">No clinical history records found for this patient.</div>
                ) : (
                    history.map((record, i) => (
                        <div key={i} className="history-card">
                            <div className="history-header">
                                <span className="record-type-badge">
                                    {record.type === "Consultation" ? <FaFileAlt /> : <FaPrescription />}
                                    {record.type}
                                </span>
                                <span className="history-date">
                                    {new Date(record.created_at).toLocaleString("en-IN")}
                                </span>
                            </div>
                            <div className="history-body">
                                {record.type === "Consultation" && (
                                    <>
                                        <p><strong>Diagnosis:</strong> {record.data?.diagnosis || "N/A"}</p>
                                        <p><strong>Chief Complaint:</strong> {record.data?.chiefComplaint || "N/A"}</p>
                                        {record.data?.mse && (
                                            <div className="mse-summary">
                                                <strong>MSE Snippet:</strong> {record.data.mse.Mood}, {record.data.mse.Affect}
                                            </div>
                                        )}
                                    </>
                                )}
                                {record.type === "Prescription" && (
                                    <div className="meds-list">
                                        <strong>Medications:</strong>
                                        <ul>
                                            {record.data?.medications?.map((m, idx) => (
                                                <li key={idx}>{m.name} - {m.dosage} ({m.frequency})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default OPDHistory;
