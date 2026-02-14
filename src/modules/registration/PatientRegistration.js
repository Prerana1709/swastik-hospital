// Patient Registration – Bahmni-style sectioned form. Same page; no routing changes.
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrationForm.css";

const generateUHID = () => `UHID-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`;

function CollapsibleSection({ title, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bahmni-section">
      <button type="button" className="bahmni-section-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <span className="bahmni-section-icon">{open ? "▼" : "▶"}</span>
      </button>
      {open && <div className="bahmni-section-body">{children}</div>}
    </div>
  );
}

function PatientRegistration() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [uhid] = useState(() => generateUHID());
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    age: "",
    dateOfBirth: "",
    estimatedAge: false,
    gender: "",
    houseNoStreet: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    fatherHusbandName: "",
    identificationMark: "",
    smokingHistory: false,
    familyIncome: "",
    rationCardType: "",
    urbanRural: false,
    distanceFromCenter: "",
    relationshipType: "",
    relatedPersonNameOrId: "",
    relationshipValidTill: "",
    dateOfDeath: "",
    causeOfDeath: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const registrationDate = useMemo(() => new Date().toLocaleDateString("en-IN", { dateStyle: "long" }), []);

  const handleSave = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { uhid, registrationDate, ...form };
    console.log("Patient Registration saved (local state):", payload);
    setTimeout(() => {
      setSubmitting(false);
      alert("Patient saved successfully. (Check console for data)");
    }, 500);
  };

  const startVisit = (visitType) => {
    const payload = { uhid, registrationDate, visitType, ...form };
    console.log("Start Visit:", visitType, payload);
    navigate("/clinical", { state: { fromRegistration: true, visitType, patientId: 1, patientName: form.patientName, uhid } });
  };

  const handlePrint = (option) => {
    console.log("Print requested:", option);
    window.print();
  };

  return (
    <div className="registration-page-wrapper">
      <div className="registration-form-page">
        <div className="registration-form-header-row">
          <div>
            <h2>Patient Registration</h2>
            <p className="registration-form-subtitle">Register new patients and generate UHID</p>
          </div>
          <div className="print-actions no-print">
            <button type="button" className="print-btn" onClick={() => handlePrint("registration-card")}>
              Print Registration Card
            </button>
            <button type="button" className="print-btn" onClick={() => handlePrint("patient-summary")}>
              Print Patient Summary
            </button>
          </div>
        </div>

        <div className="patient-summary-print print-only-content">
          <h3 className="print-hospital-name">Swastik Hospital</h3>
          <p><strong>Patient Identifier (UHID):</strong> {uhid}</p>
          <p><strong>Patient Name:</strong> {form.patientName || "—"}</p>
          <p><strong>Age / Gender:</strong> {form.age || "—"} / {form.gender || "—"}</p>
          <p><strong>Address:</strong> {[form.houseNoStreet, form.village, form.district, form.state, form.pincode].filter(Boolean).join(", ") || "—"}</p>
          <p><strong>Registration Date:</strong> {registrationDate}</p>
        </div>

        <form onSubmit={handleSave} className="registration-form-fields bahmni-form">
          <CollapsibleSection title="Demographics" defaultOpen>
            <div className="form-row full-width">
              <label>Patient Identifier (UHID)</label>
              <input type="text" value={uhid} readOnly className="readonly-uhid" />
            </div>
            <div className="form-row">
              <label>Patient Name *</label>
              <input name="patientName" value={form.patientName} onChange={handleChange} placeholder="Full name" required />
            </div>
            <div className="form-row">
              <label>Phone Number *</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone" required />
            </div>
            <div className="form-row">
              <label>Age / Date of Birth</label>
              <div className="age-dob-row">
                <input name="age" value={form.age} onChange={handleChange} placeholder="Age" />
                <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" name="estimatedAge" checked={form.estimatedAge} onChange={handleChange} />
                Estimated Age
              </label>
            </div>
            <div className="form-row">
              <label>Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Address Information" defaultOpen>
            <div className="form-row full-width">
              <label>House No / Street</label>
              <input name="houseNoStreet" value={form.houseNoStreet} onChange={handleChange} placeholder="House no, street" />
            </div>
            <div className="form-row">
              <label>Village *</label>
              <input name="village" value={form.village} onChange={handleChange} placeholder="Village" required />
            </div>
            <div className="form-row">
              <label>District *</label>
              <input name="district" value={form.district} onChange={handleChange} placeholder="District" required />
            </div>
            <div className="form-row">
              <label>State *</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
            </div>
            <div className="form-row">
              <label>Pincode *</label>
              <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" required />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Other Information" defaultOpen>
            <div className="form-row">
              <label>Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="form-row">
              <label>Education Details</label>
              <input name="education" value={form.education} onChange={handleChange} placeholder="Education" />
            </div>
            <div className="form-row">
              <label>Occupation</label>
              <input name="occupation" value={form.occupation} onChange={handleChange} placeholder="Occupation" />
            </div>
            <div className="form-row">
              <label>Father's / Husband's Name</label>
              <input name="fatherHusbandName" value={form.fatherHusbandName} onChange={handleChange} placeholder="Name" />
            </div>
            <div className="form-row full-width">
              <label>Identification Mark</label>
              <input name="identificationMark" value={form.identificationMark} onChange={handleChange} placeholder="Identification mark" />
            </div>
            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" name="smokingHistory" checked={form.smokingHistory} onChange={handleChange} />
                Smoking History
              </label>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Additional Patient Information">
            <div className="form-row">
              <label>Family Income</label>
              <input name="familyIncome" value={form.familyIncome} onChange={handleChange} placeholder="Income" />
            </div>
            <div className="form-row">
              <label>Ration Card Type</label>
              <select name="rationCardType" value={form.rationCardType} onChange={handleChange}>
                <option value="">Select</option>
                <option value="APL">APL</option>
                <option value="BPL">BPL</option>
                <option value="AAY">AAY</option>
                <option value="None">None</option>
              </select>
            </div>
            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" name="urbanRural" checked={form.urbanRural} onChange={handleChange} />
                Urban / Rural
              </label>
            </div>
            <div className="form-row">
              <label>Distance from Center (km)</label>
              <input name="distanceFromCenter" type="text" value={form.distanceFromCenter} onChange={handleChange} placeholder="km" />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Relationships">
            <div className="form-row">
              <label>Relationship Type</label>
              <select name="relationshipType" value={form.relationshipType} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Doctor">Doctor</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
              </select>
            </div>
            <div className="form-row">
              <label>Related Person Name or ID</label>
              <input name="relatedPersonNameOrId" value={form.relatedPersonNameOrId} onChange={handleChange} placeholder="Name or ID" />
            </div>
            <div className="form-row">
              <label>Relationship Valid Till</label>
              <input name="relationshipValidTill" type="date" value={form.relationshipValidTill} onChange={handleChange} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Death Information" defaultOpen={false}>
            <div className="form-row">
              <label>Date of Death</label>
              <input name="dateOfDeath" type="date" value={form.dateOfDeath} onChange={handleChange} />
            </div>
            <div className="form-row full-width">
              <label>Cause of Death</label>
              <input name="causeOfDeath" value={form.causeOfDeath} onChange={handleChange} placeholder="Cause" />
            </div>
          </CollapsibleSection>

          <div className="visit-actions no-print">
            <button type="submit" className="registration-submit-btn" disabled={submitting}>
              {submitting ? "Saving..." : "Save Patient"}
            </button>
            {/* <button type="button" className="visit-btn" onClick={() => startVisit("opd")} disabled={submitting}>Start OPD Visit</button>
            <button type="button" className="visit-btn" onClick={() => startVisit("ipd")} disabled={submitting}>Start IPD Visit</button>
            <button type="button" className="visit-btn" onClick={() => startVisit("emergency")} disabled={submitting}>Start Emergency Visit</button>
            <button type="button" className="visit-btn" onClick={() => startVisit("lab")} disabled={submitting}>Start Lab Visit</button>
            <button type="button" className="visit-btn" onClick={() => startVisit("pharmacy")} disabled={submitting}>Start Pharmacy Visit</button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientRegistration;
