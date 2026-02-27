import React, { useState } from "react";
import { FaFileMedicalAlt, FaPaperPlane } from "react-icons/fa";
import { api } from "../../../api/service";

const LAB_TESTS_CATEGORIES = [
    {
        category: "General / Hematology",
        tests: ["CBC", "RBS", "Serum Creatinine", "Uric Acid", "Serum Electrolytes"]
    },
    {
        category: "Psychiatric Screen",
        tests: ["TFT (T3, T4, TSH)", "Vitamin B12", "Vitamin D3", "Serum Lithium", "Serum Valproate"]
    },
    {
        category: "Urinary / Drug Screen",
        tests: ["Urine Routine", "Urine Drug Screen (10 Panel)", "Urine Pregnancy Test"]
    },
    {
        category: "Imaging / Others",
        tests: ["ECG", "EEG", "CT Head", "MRI Brain"]
    }
];

function OPDLabOrders({ patientData }) {
    const [selectedTests, setSelectedTests] = useState([]);
    const [priority, setPriority] = useState("Normal");
    const [notes, setNotes] = useState("");

    const toggleTest = (test) => {
        setSelectedTests(prev =>
            prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
        );
    };

    const handleSubmit = async () => {
        if (selectedTests.length === 0) {
            alert("Please select at least one test");
            return;
        }

        try {
            const order = {
                uhid: patientData.uhid,
                patientName: patientData.name,
                tests: selectedTests.join(", "),
                source: "OPD",
                priority: priority,
                clinicalNotes: notes
            };
            await api.createLabRequest(order);
            alert("Lab orders submitted successfully");
            setSelectedTests([]);
            setNotes("");
        } catch (err) {
            console.error(err);
            alert("Failed to submit lab order");
        }
    };

    return (
        <div className="opd-lab-orders">
            <h3><FaFileMedicalAlt /> Lab Orders</h3>

            <div className="lab-selector-grid">
                {LAB_TESTS_CATEGORIES.map((cat, i) => (
                    <div key={i} className="lab-category-card">
                        <h4>{cat.category}</h4>
                        <div className="tests-list">
                            {cat.tests.map(test => (
                                <label key={test} className="test-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedTests.includes(test)}
                                        onChange={() => toggleTest(test)}
                                    />
                                    <span>{test}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="order-details-form">
                <div className="form-group">
                    <label>Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option>Normal</option>
                        <option>Urgent</option>
                        <option>Stat</option>
                    </select>
                </div>
                <div className="form-group full-width">
                    <label>Special Instructions / Clinical Context</label>
                    <textarea
                        placeholder="Reason for test, fasting status, etc..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="2"
                    />
                </div>
            </div>

            <div className="order-summary-footer">
                <div className="summary-info">
                    <strong>Selected ({selectedTests.length}):</strong> {selectedTests.join(", ") || "None"}
                </div>
                <button className="submit-order-btn" onClick={handleSubmit}>
                    <FaPaperPlane /> Submit Lab Order
                </button>
            </div>
        </div>
    );
}

export default OPDLabOrders;
