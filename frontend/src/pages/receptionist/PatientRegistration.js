import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiCheckCircle } from 'react-icons/fi';
import {
  generateUHID,
  generateCaseNumber,
  generateVisitId,
  generateQueueToken,
  STORAGE_KEYS,
  getEmergencyQueue,
  setEmergencyQueue,
  HOSPITAL_PRICING,
  saveInvoice,
  generateInvoiceID,
} from "./receptionistData";
import BillingReceipt from "./BillingReceipt";
import "./PatientRegistration.css";

const STEPS = [
  "Basic Information",
  "Guardian / Caregiver",
  "Emergency Contact",
  "Clinical Pre-Screen",
  "Visit Type",
  "Insurance",
  "Document Upload",
  "Generate Case Paper",
];

const initialForm = {
  fullName: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  occupation: "",
  contact: "",
  email: "",
  address: "",
  guardianName: "",
  guardianRelation: "",
  guardianContact: "",
  guardianAddress: "",
  guardianIdType: "",
  guardianIdNumber: "",
  guardianConsent: false,
  emergencyName: "",
  emergencyRelation: "",
  emergencyContact: "",
  prevPsychiatric: "",
  onMedication: "",
  medicationDetails: "",
  substanceHistory: "",
  selfHarmHistory: "",
  violentHistory: "",
  visitType: "",
  insuranceProvider: "",
  policyNumber: "",
  validTill: "",
  selfPay: false,
  docGovId: "",
  docInsurance: "",
  docConsent: "",
};

function PatientRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmergency = location.state?.emergency === true;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [uhid] = useState(() => generateUHID());
  const [riskFlag, setRiskFlag] = useState(false);
  const [highObservation, setHighObservation] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  useEffect(() => {
    if (step === 4 && (form.selfHarmHistory === "yes" || form.violentHistory === "yes")) {
      setRiskFlag(true);
      setHighObservation(true);
    }
  }, [step, form.selfHarmHistory, form.violentHistory]);

  const age = useMemo(() => {
    if (!form.dob) return null;
    const birth = new Date(form.dob);
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [form.dob]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 8) {
      setStep((s) => s + 1);
      return;
    }
    const caseNumber = generateCaseNumber();
    const visitId = generateVisitId();
    const queueToken = generateQueueToken();
    const patient = {
      uhid,
      caseNumber,
      visitId,
      queueToken,
      ...form,
      age,
      riskFlag,
      highObservation,
      isEmergency,
      registeredAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_PATIENTS) || "[]");
    localStorage.setItem(STORAGE_KEYS.REGISTERED_PATIENTS, JSON.stringify([...existing, patient]));
    if (isEmergency) {
      const queue = getEmergencyQueue();
      setEmergencyQueue([...queue, { id: patient.visitId, patientName: patient.fullName, reason: "Emergency registration" }]);
    }
    setGeneratedPaper({ uhid: patient.uhid, caseNumber: patient.caseNumber, visitId: patient.visitId, queueToken: patient.queueToken, fullName: patient.fullName });

    // Generate Invoice
    const invoice = {
      id: generateInvoiceID(),
      uhid: patient.uhid,
      patientName: patient.fullName,
      visitId: patient.visitId,
      date: new Date().toISOString(),
      items: [
        { description: "Registration Fee", amount: HOSPITAL_PRICING.REGISTRATION },
        { description: "Case Paper Charges", amount: HOSPITAL_PRICING.CASE_PAPER },
      ],
      totalAmount: HOSPITAL_PRICING.REGISTRATION + HOSPITAL_PRICING.CASE_PAPER,
      status: "paid", // For demo, assume registration fee is collected immediately
    };
    saveInvoice(invoice);
    setGeneratedInvoice(invoice);

    setStep(8);
  };

  const handlePrint = () => {
    window.print();
  };

  const showBedAllocation = form.visitType === "admission";

  return (
    <div className="recep-reg">
      <div className="recep-reg-header">
        <h1 className="recep-reg-title">Psychiatric Registration</h1>
        {isEmergency && <span className="recep-badge-emergency">EMERGENCY</span>}
        <p className="recep-reg-uhid">UHID: {uhid}</p>
      </div>

      {/* Stepper */}
      <div className="recep-reg-stepper">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`recep-reg-step ${i + 1 === step ? "active" : ""} ${i + 1 < step ? "done" : ""}`}
          >
            <span className="recep-reg-step-num">{i + 1}</span>
            <span className="recep-reg-step-label">{label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="recep-reg-form">
        {/* Step 1 – Basic Information */}
        {step === 1 && (
          <div className="recep-reg-step-content">
            <h2>Basic Information</h2>
            <div className="recep-reg-grid">
              <div className="recep-reg-field full">
                <label>Full Name *</label>
                <input type="text" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Full name" />
              </div>
              <div className="recep-reg-field">
                <label>Date of Birth *</label>
                <input type="date" required value={form.dob} onChange={(e) => update("dob", e.target.value)} />
              </div>
              <div className="recep-reg-field">
                <label>Age</label>
                <input type="text" readOnly value={age != null ? age : ""} placeholder="Auto" />
              </div>
              <div className="recep-reg-field">
                <label>Gender *</label>
                <select required value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="recep-reg-field">
                <label>Marital Status</label>
                <select value={form.maritalStatus} onChange={(e) => update("maritalStatus", e.target.value)}>
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div className="recep-reg-field">
                <label>Occupation</label>
                <input type="text" value={form.occupation} onChange={(e) => update("occupation", e.target.value)} placeholder="Occupation" />
              </div>
              <div className="recep-reg-field">
                <label>Contact Number *</label>
                <input type="tel" required value={form.contact} onChange={(e) => update("contact", e.target.value)} placeholder="Contact" />
              </div>
              <div className="recep-reg-field">
                <label>Email (optional)</label>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" />
              </div>
              <div className="recep-reg-field full">
                <label>Address *</label>
                <input type="text" required value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Address" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 – Guardian */}
        {step === 2 && (
          <div className="recep-reg-step-content">
            <h2>Guardian / Caregiver Information (Mandatory)</h2>
            <div className="recep-reg-grid">
              <div className="recep-reg-field full">
                <label>Guardian Name *</label>
                <input type="text" required value={form.guardianName} onChange={(e) => update("guardianName", e.target.value)} />
              </div>
              <div className="recep-reg-field">
                <label>Relationship *</label>
                <input type="text" required value={form.guardianRelation} onChange={(e) => update("guardianRelation", e.target.value)} placeholder="e.g. Father" />
              </div>
              <div className="recep-reg-field">
                <label>Contact *</label>
                <input type="tel" required value={form.guardianContact} onChange={(e) => update("guardianContact", e.target.value)} />
              </div>
              <div className="recep-reg-field full">
                <label>Address *</label>
                <input type="text" required value={form.guardianAddress} onChange={(e) => update("guardianAddress", e.target.value)} />
              </div>
              <div className="recep-reg-field">
                <label>ID Proof Type</label>
                <select value={form.guardianIdType} onChange={(e) => update("guardianIdType", e.target.value)}>
                  <option value="">Select</option>
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="PAN">PAN</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>
              <div className="recep-reg-field">
                <label>ID Number</label>
                <input type="text" value={form.guardianIdNumber} onChange={(e) => update("guardianIdNumber", e.target.value)} />
              </div>
              <div className="recep-reg-field full">
                <label className="recep-reg-check">
                  <input type="checkbox" required checked={form.guardianConsent} onChange={(e) => update("guardianConsent", e.target.checked)} />
                  I confirm I am the legal guardian/responsible person.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 – Emergency Contact */}
        {step === 3 && (
          <div className="recep-reg-step-content">
            <h2>Emergency Contact</h2>
            <div className="recep-reg-grid">
              <div className="recep-reg-field">
                <label>Name *</label>
                <input type="text" required value={form.emergencyName} onChange={(e) => update("emergencyName", e.target.value)} />
              </div>
              <div className="recep-reg-field">
                <label>Relationship *</label>
                <input type="text" required value={form.emergencyRelation} onChange={(e) => update("emergencyRelation", e.target.value)} />
              </div>
              <div className="recep-reg-field">
                <label>Contact Number *</label>
                <input type="tel" required value={form.emergencyContact} onChange={(e) => update("emergencyContact", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 – Clinical Pre-Screen */}
        {step === 4 && (
          <div className="recep-reg-step-content">
            <h2>Clinical Pre-Screen (Basic only – no diagnosis)</h2>
            {riskFlag && (
              <div className="recep-reg-risk">
                <strong>Risk Flag</strong> – Patient marked for High Observation. Doctor will be notified.
              </div>
            )}
            <div className="recep-reg-grid">
              <div className="recep-reg-field">
                <label>Previous psychiatric treatment?</label>
                <select value={form.prevPsychiatric} onChange={(e) => update("prevPsychiatric", e.target.value)}>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="recep-reg-field">
                <label>Currently on medication?</label>
                <select value={form.onMedication} onChange={(e) => update("onMedication", e.target.value)}>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {form.onMedication === "yes" && (
                <div className="recep-reg-field full">
                  <label>Medication details</label>
                  <input type="text" value={form.medicationDetails} onChange={(e) => update("medicationDetails", e.target.value)} placeholder="Details" />
                </div>
              )}
              <div className="recep-reg-field">
                <label>Substance use history?</label>
                <select value={form.substanceHistory} onChange={(e) => update("substanceHistory", e.target.value)}>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="recep-reg-field">
                <label>Self-harm history?</label>
                <select value={form.selfHarmHistory} onChange={(e) => update("selfHarmHistory", e.target.value)}>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="recep-reg-field">
                <label>Violent behavior history?</label>
                <select value={form.violentHistory} onChange={(e) => update("violentHistory", e.target.value)}>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5 – Visit Type */}
        {step === 5 && (
          <div className="recep-reg-step-content">
            <h2>Visit Type Selection</h2>
            <div className="recep-reg-grid">
              <div className="recep-reg-field full">
                <label>Visit Type *</label>
                <select required value={form.visitType} onChange={(e) => update("visitType", e.target.value)}>
                  <option value="">Select</option>
                  <option value="opd">OPD Consultation</option>
                  <option value="therapy">Therapy Session</option>
                  <option value="emergency">Emergency</option>
                  <option value="admission">Admission (IPD)</option>
                </select>
              </div>
              {showBedAllocation && (
                <div className="recep-reg-field full">
                  <label>Bed allocation</label>
                  <p className="recep-dash-hint">Proceed to Admissions after registration to assign ward and bed.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 6 – Insurance */}
        {step === 6 && (
          <div className="recep-reg-step-content">
            <h2>Insurance Information</h2>
            <div className="recep-reg-grid">
              <div className="recep-reg-field full">
                <label className="recep-reg-check">
                  <input type="checkbox" checked={form.selfPay} onChange={(e) => update("selfPay", e.target.checked)} />
                  Self-Pay
                </label>
              </div>
              {!form.selfPay && (
                <>
                  <div className="recep-reg-field">
                    <label>Provider</label>
                    <input type="text" value={form.insuranceProvider} onChange={(e) => update("insuranceProvider", e.target.value)} />
                  </div>
                  <div className="recep-reg-field">
                    <label>Policy Number</label>
                    <input type="text" value={form.policyNumber} onChange={(e) => update("policyNumber", e.target.value)} />
                  </div>
                  <div className="recep-reg-field">
                    <label>Valid Till</label>
                    <input type="date" value={form.validTill} onChange={(e) => update("validTill", e.target.value)} />
                  </div>
                  <div className="recep-reg-field full">
                    <label>Upload Insurance Card</label>
                    <input type="file" accept="image/*,.pdf" onChange={(e) => update("docInsurance", e.target.files?.[0]?.name || "")} />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 7 – Document Upload */}
        {step === 7 && (
          <div className="recep-reg-step-content">
            <h2>Document Upload</h2>
            <div className="recep-reg-grid">
              <div className="recep-reg-field">
                <label>Government ID</label>
                <input type="file" accept="image/*,.pdf" />
              </div>
              <div className="recep-reg-field">
                <label>Insurance Card</label>
                <input type="file" accept="image/*,.pdf" />
              </div>
              <div className="recep-reg-field">
                <label>Consent Form</label>
                <input type="file" accept="image/*,.pdf" />
              </div>
            </div>
          </div>
        )}

        {/* Step 8 – Case Paper (summary / print) */}
        {step === 8 && (
          <div className="recep-reg-step-content recep-reg-summary">
            <h2 style={{ color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <FiCheckCircle /> Registration Successful
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem', alignItems: 'start', marginTop: '2rem' }}>
              {/* Case Paper Card */}
              <div className="recep-reg-paper" style={{ margin: 0, width: '100%', minWidth: 'unset' }}>
                <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Case Details</h3>
                {generatedPaper && (
                  <>
                    <p><strong>UHID:</strong> {generatedPaper.uhid}</p>
                    <p><strong>Case Number:</strong> {generatedPaper.caseNumber}</p>
                    <p><strong>Visit ID:</strong> {generatedPaper.visitId}</p>
                    <p><strong>Token:</strong> {generatedPaper.queueToken}</p>
                    <p><strong>Patient:</strong> {generatedPaper.fullName}</p>
                    <button type="button" className="recep-btn recep-btn-primary recep-print-btn" onClick={handlePrint} style={{ width: '100%', marginTop: '1.5rem' }}>
                      🖨 Print Case Paper
                    </button>
                  </>
                )}
              </div>

              {/* Billing Receipt */}
              <div>
                <h3 style={{ marginBottom: '1.25rem', textAlign: 'left' }}>Payment Receipt</h3>
                <BillingReceipt invoice={generatedInvoice} />
              </div>
            </div>

            <div style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
              <button type="button" className="recep-btn recep-btn-secondary" onClick={() => navigate("/receptionist")}>
                Go to Dashboard
              </button>
              <button type="button" className="recep-btn recep-btn-primary" style={{ marginLeft: '1rem' }} onClick={() => window.location.reload()}>
                Register Another Patient
              </button>
            </div>
          </div>
        )}

        {step < 8 && !generatedPaper && (
          <div className="recep-reg-actions">
            {step > 1 && (
              <button type="button" className="recep-btn recep-btn-secondary" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            <button type="submit" className="recep-btn recep-btn-primary">
              {step === 7 ? "Submit & Generate Case Paper" : "Next"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default PatientRegistration;
