import React, { useState, useEffect } from "react";
import { FiCreditCard, FiSearch, FiPlus, FiFileText, FiPrinter, FiUser, FiXCircle } from 'react-icons/fi';
import { STORAGE_KEYS, getInvoices, saveInvoice, HOSPITAL_PRICING, generateInvoiceID } from "./receptionistData";
import BillingReceipt from "./BillingReceipt";
import swastikLogo from "../../assets/swastiklogo.png";
import orelseLogo from "../../assets/orelse.png";
import "./ReceptionistDashboard.css";

export default function ReceptionistBilling() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patient, setPatient] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [showInvoiceCreator, setShowInvoiceCreator] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [activeCategory, setActiveCategory] = useState("CONSULTATION");

  useEffect(() => {
    refreshInvoices();
  }, []);

  const refreshInvoices = () => {
    const all = getInvoices();
    setInvoices(all);
  };

  const handleSearch = () => {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_PATIENTS);
    const patients = raw ? JSON.parse(raw) : [];
    const found = patients.find(p =>
      p.uhid.toLowerCase() === searchQuery.trim().toLowerCase() ||
      p.fullName.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    setPatient(found || null);
    if (!found) setViewingInvoice(null);
  };

  const toggleItem = (itemKey, description, amount) => {
    if (selectedItems.find(i => i.key === itemKey)) {
      setSelectedItems(selectedItems.filter(i => i.key !== itemKey));
    } else {
      setSelectedItems([...selectedItems, { key: itemKey, description, amount }]);
    }
  };

  const createInvoice = () => {
    if (!patient || selectedItems.length === 0) return;

    const newInvoice = {
      id: generateInvoiceID(),
      uhid: patient.uhid,
      patientName: patient.fullName,
      visitId: patient.visitId || "N/A",
      date: new Date().toISOString(),
      items: selectedItems.map(i => ({ description: i.description, amount: i.amount })),
      totalAmount: selectedItems.reduce((sum, i) => sum + i.amount, 0),
      status: "paid", // Simplified for demo
    };

    saveInvoice(newInvoice);
    refreshInvoices();
    setViewingInvoice(newInvoice);
    setShowInvoiceCreator(false);
    setSelectedItems([]);
  };

  const patientInvoices = invoices.filter(inv => patient && inv.uhid === patient.uhid);

  // Categorize services
  const categories = {
    "CONSULTATION": ["REGISTRATION", "CASE_PAPER", "OPD_CONSULTATION", "SPECIALIST_CONSULTATION", "EMERGENCY_VISIT"],
    "WARDS/IPD": ["IPD_GENERAL_BED", "IPD_PRIVATE_ROOM", "IPD_OBSERVATION", "ICU_CHARGES"],
    "LABORATORY": ["BLOOD_TEST_CBC", "KIDNEY_PROFILE", "LIVER_FUNCTION_TEST", "URINE_ANALYSIS", "COVID_RT_PCR"],
    "RADIOLOGY": ["X_RAY_CHEST", "ULTRASOUND_ABDOMEN", "MRI_BRAIN", "CT_SCAN_WHOLE_BODY"],
    "PHARMACY": ["MEDICATION_PACKAGE_BASIC", "SURGICAL_CONSUMABLES", "IV_FLUIDS_SET"],
    "PROCEDURES": ["MINOR_STITCHING", "DRESSING_CHARGES", "PHYSIOTHERAPY_SESSION"]
  };

  return (
    <div className="recep-dash" style={{ display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>

      {/* Official Top Branding */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #1a5f5c' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={swastikLogo} alt="Logo" style={{ height: '50px', filter: 'brightness(0.95) saturate(1.3) hue-rotate(-15deg) sepia(0.15)' }} />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1a5f5c', letterSpacing: '1px' }}>SWASTIK HOSPITAL</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>BILLING & REVENUE MANAGEMENT</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Operator: <strong>Receptionist</strong></p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Real-time Sync: <span style={{ color: '#059669' }}>Connected</span></p>
        </div>
      </div>

      <header style={{ marginBottom: '2rem' }}>
        <h1 className="recep-dash-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Hospital Billing Center</h1>
        <p className="recep-dash-subtitle">Manage patient accounts, medical services, and official receipts.</p>
      </header>

      {/* Search Header */}
      <section className="recep-dash-section">
        <div className="recep-table-wrap" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="recep-reg-field" style={{ flex: 1, maxWidth: '400px' }}>
            <label style={{ fontWeight: 700, color: '#1a5f5c' }}>Patient Registry Lookup</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#1a5f5c' }} />
              <input
                type="text"
                placeholder="Enter Full Name or UHID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.75rem', width: '100%', borderColor: '#cbd5e1' }}
              />
            </div>
          </div>
          <button className="recep-btn recep-btn-primary" onClick={handleSearch} style={{ height: '46px', padding: '0 2rem', background: '#1a5f5c' }}>
            <FiSearch style={{ marginRight: '8px' }} /> Locate Record
          </button>
        </div>
      </section>

      {patient ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '2.5rem', marginTop: '2.5rem' }}>
          {/* Left Column: Patient Invoices */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="recep-dash-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiFileText color="#1a5f5c" /> Patient Financial Record
              </h2>
              <button className="recep-btn recep-btn-primary" onClick={() => setShowInvoiceCreator(!showInvoiceCreator)} style={{ background: showInvoiceCreator ? '#e11d48' : '#1a5f5c' }}>
                {showInvoiceCreator ? <><FiXCircle style={{ marginRight: '8px' }} /> Cancel Entry</> : <><FiPlus style={{ marginRight: '8px' }} /> Add Service</>}
              </button>
            </div>

            {showInvoiceCreator && (
              <div className="recep-table-wrap" style={{ padding: '1.5rem', marginBottom: '2.5rem', border: '2px solid #1a5f5c', background: '#fff' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1a5f5c', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>Medical Service Selection</h3>

                {/* Category Tabs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {Object.keys(categories).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid #1a5f5c',
                        background: activeCategory === cat ? '#1a5f5c' : 'white',
                        color: activeCategory === cat ? 'white' : '#1a5f5c',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {categories[activeCategory].map(key => {
                    const price = HOSPITAL_PRICING[key];
                    return (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <input
                          type="checkbox"
                          checked={selectedItems.some(i => i.key === key)}
                          onChange={() => toggleItem(key, key.replace(/_/g, ' '), price)}
                          style={{ accentColor: '#1a5f5c' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>{key.replace(/_/g, ' ')}</div>
                          <div style={{ color: '#1a5f5c', fontSize: '0.9rem', fontWeight: 800 }}>₹{price.toLocaleString()}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '1.25rem', borderRadius: '12px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Selected Items: {selectedItems.length}</span>
                    <h3 style={{ margin: 0, color: '#1a5f5c', fontSize: '1.5rem' }}>Total: ₹{selectedItems.reduce((s, i) => s + i.amount, 0).toLocaleString()}</h3>
                  </div>
                  <button className="recep-btn recep-btn-primary" onClick={createInvoice} disabled={selectedItems.length === 0} style={{ padding: '0.75rem 2.5rem', background: '#1a5f5c' }}>
                    Generate Official Bill
                  </button>
                </div>
              </div>
            )}

            <div className="recep-table-wrap">
              <table className="recep-table">
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ color: '#1a5f5c' }}>Invoice ID</th>
                    <th style={{ color: '#1a5f5c' }}>Date</th>
                    <th style={{ color: '#1a5f5c' }}>Amount</th>
                    <th style={{ color: '#1a5f5c' }}>Status</th>
                    <th style={{ textAlign: 'right', color: '#1a5f5c' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientInvoices.length === 0 ? (
                    <tr><td colSpan={5} className="recep-table-empty">No billing records found for this patient.</td></tr>
                  ) : (
                    patientInvoices.sort((a, b) => new Date(b.date) - new Date(a.date)).map(inv => (
                      <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => setViewingInvoice(inv)}>
                        <td><code style={{ background: '#f1f5f9', color: '#1a5f5c', padding: '2px 6px', borderRadius: '4px' }}>{inv.id}</code></td>
                        <td>{new Date(inv.date).toLocaleDateString()}</td>
                        <td><strong>₹{inv.totalAmount.toLocaleString()}</strong></td>
                        <td><span className="recep-status recep-status-completed" style={{ background: '#dcfce7', color: '#166534', fontWeight: 700 }}>PAID</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="recep-btn recep-btn-small" style={{ borderColor: '#1a5f5c', color: '#1a5f5c' }}><FiPrinter /> View</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Receipt View */}
          <div>
            <h2 className="recep-dash-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FiPrinter color="#1a5f5c" /> Receipt Preview
            </h2>
            {viewingInvoice ? (
              <BillingReceipt invoice={viewingInvoice} />
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #cbd5e1' }}>
                <FiFileText style={{ fontSize: '3.5rem', color: '#cbd5e1', marginBottom: '1.5rem' }} />
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Select an invoice record to populate the official payment receipt for printing.</p>
              </div>
            )}
          </div>
        </div>
      ) : searchQuery && searchQuery.length > 2 ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '24px', marginTop: '2.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <FiXCircle style={{ fontSize: '4rem', color: '#f43f5e', marginBottom: '1.5rem' }} />
          <h2 style={{ color: '#1e293b' }}>No Record Found</h2>
          <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>We couldn&apos;t find any registration for &quot;{searchQuery}&quot;. Please verify the UHID or register the patient first.</p>
          <button className="recep-btn recep-btn-primary" style={{ marginTop: '2rem', background: '#1a5f5c' }}>New Registration</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '8rem 2rem', background: '#fff', borderRadius: '32px', marginTop: '2.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <FiCreditCard style={{ fontSize: '5rem', color: '#1a5f5c', opacity: 0.1, marginBottom: '2rem' }} />
          <h2 style={{ color: '#1a5f5c', fontWeight: 800 }}>Hospital Financial Management</h2>
          <p style={{ color: '#64748b', maxWidth: '500px', margin: '1rem auto' }}>
            Securely manage patient service charges, pharmacy dues, and lab test invoices. Locate a patient by their official UHID to begin.
          </p>
        </div>
      )}

      {/* Official Footer */}
      <footer style={{ marginTop: 'auto', paddingTop: '4rem', paddingBottom: '2rem', textAlign: 'center' }}>
        <img src={orelseLogo} alt="or else" style={{ height: '30px', marginBottom: '10px' }} />
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>powered by possibilities</p>
        <p style={{ margin: '8px 0 0', fontSize: '0.7rem', color: '#94a3b8' }}>SWASTIK HOSPITAL ADMINISTRATION PORTAL v2.0</p>
      </footer>
    </div>
  );
}
