// Lab result entry: Live data integration, persistent results, and multi-test management.
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaCheckDouble } from "react-icons/fa";
import "./lab.css";
import { api } from "../../api/service";

function LabResultEntry() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [criticalModal, setCriticalModal] = useState(null);
  const [criticalTestId, setCriticalTestId] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getLabRequest(orderId);

        // Fetch full patient details to get age/gender for the report
        try {
          const patient = await api.getPatient(data.uhid);
          data.age = patient.age;
          data.gender = patient.gender;
        } catch (pErr) {
          console.warn("Could not fetch patient details for lab report:", pErr);
        }

        setOrder(data);

        // If results exist, use them; otherwise, parse tests string into individual test objects
        if (data.results && data.results.length > 0) {
          setTests(data.results);
          if (data.status === "VERIFIED" || data.status === "REPORTED") setVerified(true);
        } else {
          // Split tests string (e.g., "CBC, RBS") and create initial test objects
          const testNames = data.tests.split(',').map(t => t.trim());
          const initialTests = testNames.map((name, index) => ({
            id: index + 1,
            name,
            unit: name.includes("Hemoglobin") ? "g/dL" : "-",
            normalRange: name.includes("Hemoglobin") ? "12-16" : "-",
            value: "",
            remarks: "",
            flag: "Normal"
          }));
          setTests(initialTests);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const updateTest = useCallback((id, field, val) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  }, []);

  const handleSaveDraft = async () => {
    try {
      await api.saveLabResults(orderId, {
        results: tests,
        status: "IN_TEST"
      });
      alert("Draft results saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save draft: " + err.message);
    }
  };

  const handleVerifyPublish = async () => {
    if (tests.some(t => !t.value)) {
      if (!window.confirm("Some test values are empty. Do you want to proceed?")) return;
    }

    try {
      const isCritical = tests.some(t => t.flag === "Critical");
      await api.saveLabResults(orderId, {
        results: tests,
        status: isCritical ? "CRITICAL" : "VERIFIED"
      });
      setVerified(true);
      alert("Results verified and published successfully");
      navigate("/lab/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to verify results: " + err.message);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const isCritical = tests.some(t => t.flag === "Critical");

    printWindow.document.write(`
      <html><head><title>Lab Report - ${order.patientName}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #2f6f6c; padding-bottom: 15px; margin-bottom: 25px; }
        .hospital-name { font-size: 28px; font-weight: bold; color: #2f6f6c; }
        .report-title { font-size: 20px; font-weight: bold; color: #111827; text-align: right; }
        .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 25px; }
        .label { font-weight: bold; color: #6b7280; font-size: 13px; display: block; margin-bottom: 2px; }
        .value { font-size: 15px; color: #111827; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f9fafb; color: #2f6f6c; text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; font-size: 14px; }
        td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        .flag-high { color: #b91c1c; font-weight: bold; }
        .critical-alert { background: #fee2e2; border: 1px solid #fecaca; color: #b91c1c; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; text-align: center; }
        .footer { margin-top: 60px; display: flex; justify-content: space-between; padding: 0 40px; }
        .sig-box { text-align: center; border-top: 1px solid #9ca3af; width: 200px; padding-top: 10px; font-size: 13px; color: #4b5563; }
        @media print { .no-print { display: none; } }
      </style></head>
      <body>
        <div class="header">
          <div>
            <div class="hospital-name">SWASTIK HOSPITAL</div>
            <div style="color: #6b7280; font-weight: 500;">Psychiatric Laboratory & Diagnostic Centre</div>
          </div>
          <div class="report-title">LABORATORY REPORT</div>
        </div>

        ${isCritical ? '<div class="critical-alert">CRITICAL VALUE ALERT: CLINICAL CORRELATION REQUIRED</div>' : ''}

        <div class="patient-info">
          <div>
            <span class="label">Patient Name</span>
            <span class="value">${order.patientName}</span>
          </div>
          <div>
            <span class="label">UHID / Registration ID</span>
            <span class="value">${order.uhid}</span>
          </div>
          <div>
            <span class="label">Age / Gender</span>
            <span class="value">${order.age || 'N/A'} / ${order.gender || 'N/A'}</span>
          </div>
          <div>
            <span class="label">Order Date</span>
            <span class="value">${new Date(order.created_at).toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span class="label">Order ID</span>
            <span class="value">${order.orderId}</span>
          </div>
          <div>
            <span class="label">Sample ID</span>
            <span class="value">${order.sampleId || 'Not Assigned'}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Investigation / Parameter</th>
              <th>Observed Value</th>
              <th>Units</th>
              <th>Biological Reference Range</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            ${tests.map(t => `
              <tr>
                <td style="font-weight: 600;">${t.name}</td>
                <td style="font-size: 16px;">${t.value || 'N/A'}</td>
                <td>${t.unit || '-'}</td>
                <td>${t.normalRange || '-'}</td>
                <td class="${t.flag !== 'Normal' ? 'flag-high' : ''}">${t.flag || 'Normal'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 13px; color: #4b5563;">
          <strong>Clinical Remarks:</strong> ${tests.map(t => t.remarks).filter(r => r).join("; ") || "Within normal biological limits unless flagged."}
        </div>

        <div class="footer">
          <div class="sig-box">
            <strong>Lab Technician</strong><br/>
            Verified at ${new Date().toLocaleTimeString('en-IN')}
          </div>
          <div class="sig-box">
            <strong>Consulting Pathologist</strong><br/>
            Dr. P. M. Chougule (MD)
          </div>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 11px; color: #9ca3af;">
          *** End of Report ***<br/>
          This is a computer generated report and does not require physical signature.
        </div>

        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  if (loading) return <div className="content-area lab-page"><p>Loading order data...</p></div>;
  if (!order) return <div className="content-area lab-page"><p>Order not found.</p></div>;

  return (
    <div className="content-area lab-page">
      <Link to="/lab/orders" className="lab-back-link no-print">
        <FaArrowLeft /> Back to Lab Orders
      </Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Lab Result Entry</h2>
          <p className="section-subtitle">Order ID: <strong>{orderId}</strong> | Sample ID: <strong>{order.sampleId || "N/A"}</strong></p>
        </div>
        <div className="no-print">
          <button type="button" className="lab-btn lab-btn-secondary" onClick={handleSaveDraft} disabled={verified}>
            <FaSave /> Save Draft
          </button>
          <button type="button" className="lab-btn lab-btn-primary" onClick={handleVerifyPublish} disabled={verified} style={{ marginLeft: 12 }}>
            <FaCheckDouble /> Verify & Publish
          </button>
        </div>
      </div>

      <div className="lab-section">
        <h3>Patient Info</h3>
        <div className="lab-patient-summary">
          <div className="item"><strong>Name</strong>{order.patientName}</div>
          <div className="item"><strong>UHID</strong>{order.uhid}</div>
          <div className="item"><strong>Source</strong>{order.source}</div>
          <div className="item"><strong>Status</strong>{order.status}</div>
        </div>
      </div>

      <div className="lab-section">
        <h3>Test Results</h3>
        {tests.map((t) => (
          <div key={t.id} className="lab-result-row">
            <div className="lab-form-row">
              <label>{t.name}</label>
              <input
                type="text"
                value={t.value}
                onChange={(e) => updateTest(t.id, "value", e.target.value)}
                placeholder="Result"
                readOnly={verified}
              />
            </div>
            <div className="lab-form-row" style={{ maxWidth: 100 }}>
              <label>Unit</label>
              <input type="text" value={t.unit} onChange={(e) => updateTest(t.id, "unit", e.target.value)} readOnly={verified} />
            </div>
            <div className="lab-form-row">
              <label>Normal Range</label>
              <input type="text" value={t.normalRange} onChange={(e) => updateTest(t.id, "normalRange", e.target.value)} readOnly={verified} />
            </div>
            <div className="lab-form-row">
              <label>Flag</label>
              <select
                value={t.flag}
                onChange={(e) => updateTest(t.id, "flag", e.target.value)}
                disabled={verified}
              >
                <option value="Normal">Normal</option>
                <option value="Abnormal">Abnormal</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="lab-section no-print">
        <button type="button" className="lab-btn lab-btn-secondary" onClick={handlePrint}>
          Print Report Preview
        </button>
      </div>
    </div>
  );
}

export default LabResultEntry;
