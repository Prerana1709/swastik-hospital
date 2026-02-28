import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getStaffRole, clearStaffSession } from "../../utils/staffAuth";
import {
  searchPatients,
  getAdmissionStatus,
  getDefaultItemsForVisitType,
  CATEGORIES,
} from "./billingData";
import { api } from "../../api/service";
import "./BillingDashboard.css";

const WS_BASE = (() => {
  try {
    const u = new URL(process.env.REACT_APP_API_URL || "http://localhost:8000");
    return `${u.protocol === "https:" ? "wss" : "ws"}://${u.host}`;
  } catch {
    return "ws://localhost:8000";
  }
})();

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Insurance"];

const emptyItem = () => ({
  id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  category: "Consultation",
  itemName: "",
  quantity: 1,
  unitPrice: 0,
  taxPercent: 0,
});

function BillingDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [items, setItems] = useState([emptyItem()]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [insuranceCovered, setInsuranceCovered] = useState(0);
  const [savedBill, setSavedBill] = useState(null);
  const [invoiceHtml, setInvoiceHtml] = useState("");
  const [apiError, setApiError] = useState(null);
  const wsRef = useRef(null);

  const admissionStatus = selectedPatient ? getAdmissionStatus(selectedPatient.uhid) : null;

  // WebSocket: real-time billing updates
  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/billing`);
    ws.onopen = () => { };
    ws.onmessage = (ev) => {
      try {
        const { event } = JSON.parse(ev.data || "{}");
        if (event === "bill_created" || event === "payment_updated") setSavedBill((b) => (b ? { ...b, _refreshed: Date.now() } : null));
      } catch { }
    };
    ws.onerror = () => { };
    wsRef.current = ws;
    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  const itemTotals = useMemo(() => {
    return items.map((row) => {
      const subtotal = row.quantity * row.unitPrice;
      const tax = (subtotal * (row.taxPercent || 0)) / 100;
      return { ...row, itemTotal: subtotal + tax };
    });
  }, [items]);

  const subtotal = useMemo(() => itemTotals.reduce((s, r) => s + r.quantity * r.unitPrice, 0), [itemTotals]);
  const totalTax = useMemo(() => itemTotals.reduce((s, r) => s + (r.quantity * r.unitPrice * (r.taxPercent || 0)) / 100, 0), [itemTotals]);
  const afterDiscount = Math.max(0, subtotal + totalTax - (discount || 0));
  const grandTotal = afterDiscount;
  const dueAmount = Math.max(0, grandTotal - (paidAmount || 0) - (insuranceCovered || 0));
  const patientPayable = paymentMethod === "Insurance" ? Math.max(0, grandTotal - (insuranceCovered || 0)) : grandTotal;

  const handleSearch = () => {
    setPatientSearchResults(searchPatients(searchQuery));
  };

  const handleSelectPatient = (p) => {
    setSelectedPatient(p);
    setPatientSearchResults([]);
    setSearchQuery("");
    const visitType = (p.visitType || "opd").toLowerCase();
    const defaults = getDefaultItemsForVisitType(visitType);
    setItems(defaults.length ? defaults.map((d, i) => ({ ...emptyItem(), ...d, id: `item-${Date.now()}-${i}` })) : [emptyItem()]);
    setSavedBill(null);
  };

  const addRow = () => setItems((prev) => [...prev, emptyItem()]);
  const removeRow = (id) => setItems((prev) => prev.filter((r) => r.id !== id));
  const updateItem = (id, field, value) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: field === "quantity" || field === "unitPrice" || field === "taxPercent" ? (typeof value === "string" ? parseFloat(value) || 0 : value) : value } : r)));
  };

  const handleMarkPaid = async () => {
    if (!selectedPatient) return;
    setApiError(null);
    const createdBy = localStorage.getItem("swastik_username") || "billing";
    const itemsForApi = itemTotals.map((r) => ({
      category: r.category,
      item_name: r.itemName,
      quantity: r.quantity,
      price: r.unitPrice,
      tax: (r.quantity * r.unitPrice * (r.taxPercent || 0)) / 100,
      total: r.itemTotal ?? r.quantity * r.unitPrice * (1 + (r.taxPercent || 0) / 100),
    }));
    const payload = {
      patient_id: selectedPatient.uhid,
      uhid: selectedPatient.uhid,
      visit_id: null,
      admission_id: null,
      subtotal,
      tax: totalTax,
      discount: discount || 0,
      insurance_covered: insuranceCovered || 0,
      patient_payable: patientPayable || 0,
      due_amount: dueAmount || 0,
      total: grandTotal,
      items: itemsForApi,
      created_by: createdBy,
    };
    try {
      let bill = await api.createBill(payload);
      const totalPaying = (paidAmount || 0) + (insuranceCovered || 0);
      if (totalPaying > 0) {
        if (paymentMethod === "Insurance" && (insuranceCovered || 0) > 0) {
          bill = await api.addBillPayment(bill.id, {
            amount: insuranceCovered,
            method: "Insurance",
            transaction_reference: paymentNotes || `INS-${patientPayable}`,
            created_by: createdBy,
          });
        }

        if ((paidAmount || 0) > 0) {
          bill = await api.addBillPayment(bill.id, {
            amount: paidAmount,
            method: paymentMethod === "Insurance" ? "Cash" : paymentMethod,
            transaction_reference: paymentNotes || "",
            created_by: createdBy,
          });
        }
      }
      setSavedBill({
        ...bill,
        patientName: selectedPatient.fullName,
        caseNumber: selectedPatient.caseNumber,
      });
    } catch (err) {
      setApiError(err?.message || "Failed to save bill");
    }
  };

  const buildInvoiceHtml = () => {
    const bill = savedBill || {
      invoice_number: `SWH-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-0000`,
      invoiceNumber: null,
      patientName: selectedPatient?.fullName,
      uhid: selectedPatient?.uhid,
      caseNumber: selectedPatient?.caseNumber,
      items: itemTotals,
      subtotal,
      totalTax,
      discount: discount || 0,
      total: grandTotal,
      paidAmount: paidAmount || 0,
      dueAmount,
    };
    const invNum = bill.invoice_number || bill.invoiceNumber;
    const totalPaid = (bill.payments && bill.payments.length) ? bill.payments.reduce((s, p) => s + (p.amount || 0), 0) : (bill.paidAmount || paidAmount);
    const due = (bill.total ?? grandTotal) - totalPaid - (bill.insuranceCovered ?? insuranceCovered ?? 0);
    const rows = (bill.items || itemTotals).map((r) => `<tr><td>${r.item_name || r.itemName}</td><td>${r.category}</td><td>${r.quantity}</td><td>${r.price ?? r.unitPrice}</td><td>${r.taxPercent ?? ""}%</td><td>${(r.total ?? r.itemTotal ?? 0).toFixed(2)}</td></tr>`).join("");
    return `
      <div class="invoice-print">
        <h1>Swastik Psychiatric Hospital</h1>
        <p>GST Number: 27AABCU9603R1ZM (Dummy)</p>
        <p><strong>Invoice No:</strong> ${invNum}</p>
        <p><strong>UHID:</strong> ${bill.uhid || ""} | <strong>Case No:</strong> ${bill.caseNumber || ""}</p>
        <p><strong>Patient:</strong> ${bill.patientName || ""}</p>
        <table><thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Tax %</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
        <p>Subtotal: ₹${(bill.subtotal || subtotal).toFixed(2)} | Tax: ₹${(bill.totalTax || totalTax).toFixed(2)} | Discount: ₹${(bill.discount || discount).toFixed(2)} | <strong>Grand Total: ₹${(bill.total || grandTotal).toFixed(2)}</strong></p>
        <p>Paid: ₹${totalPaid.toFixed(2)} | Due: ₹${(bill.dueAmount != null ? bill.dueAmount : due).toFixed(2)}</p>
        <p><em>All psychiatric records are confidential.</em></p>
        <p>Authorized signature: _________________________</p>
      </div>`;
  };

  const handleGenerateInvoice = () => {
    if (!selectedPatient) return;
    setInvoiceHtml(buildInvoiceHtml());
  };

  const printStyles = "body{font-family:Segoe UI,sans-serif;padding:24px}.invoice-print table{border-collapse:collapse;width:100%;margin:16px 0}.invoice-print th,.invoice-print td{border:1px solid #ddd;padding:8px}";

  const handlePrint = () => {
    const content = invoiceHtml || buildInvoiceHtml();
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Invoice</title><style>${printStyles}</style></head><body>${content}</body></html>`);
    w.document.close();
    w.print();
    w.close();
  };

  const handleDownloadPdf = () => {
    const content = invoiceHtml || buildInvoiceHtml();
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Invoice</title><style>${printStyles}</style></head><body>${content}</body></html>`);
    w.document.close();
    w.print();
    w.close();
  };

  const handleLogout = () => {
    clearStaffSession();
    navigate("/login");
  };

  return (
    <div className="billing-dash">
      <header className="billing-dash-header">
        <h1>Billing – Swastik Psychiatric Hospital</h1>
        <div className="billing-dash-header-actions">
          <span className="billing-dash-role">{getStaffRole()}</span>
          <button type="button" className="billing-dash-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="billing-dash-main">
        {/* 1. Patient Selection */}
        <section className="billing-card">
          <h2>Patient Selection</h2>
          <div className="billing-search-row">
            <input
              type="text"
              placeholder="Search by UHID, Name, or Phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button type="button" className="billing-btn billing-btn-primary" onClick={handleSearch}>Search</button>
          </div>
          {patientSearchResults.length > 0 && (
            <div className="billing-dropdown">
              {patientSearchResults.map((p) => (
                <button type="button" key={p.uhid} className="billing-dropdown-item" onClick={() => handleSelectPatient(p)}>
                  {p.uhid} – {p.fullName} – {p.contact}
                </button>
              ))}
            </div>
          )}
          {selectedPatient && (
            <div className="billing-patient-info">
              <p><strong>UHID:</strong> {selectedPatient.uhid} | <strong>Name:</strong> {selectedPatient.fullName}</p>
              <p><strong>Visit type:</strong> {selectedPatient.visitType || "OPD"} | <strong>Risk level:</strong> {selectedPatient.riskFlag ? "High (read-only)" : "—"}</p>
              {admissionStatus && <p><strong>Admission:</strong> {admissionStatus.status} {admissionStatus.ward && `– ${admissionStatus.ward} ${admissionStatus.bedNumber || ""}`}</p>}
            </div>
          )}
        </section>

        {/* 2. Billing Items Table */}
        <section className="billing-card">
          <h2>Billing Items</h2>
          <div className="billing-table-wrap">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit Price (₹)</th>
                  <th>Tax %</th>
                  <th>Item Total (₹)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    <td><input type="text" value={row.itemName} onChange={(e) => updateItem(row.id, "itemName", e.target.value)} placeholder="Item name" /></td>
                    <td>
                      <select value={row.category} onChange={(e) => updateItem(row.id, "category", e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td><input type="number" min={1} value={row.quantity} onChange={(e) => updateItem(row.id, "quantity", e.target.value)} /></td>
                    <td><input type="number" min={0} step={0.01} value={row.unitPrice} onChange={(e) => updateItem(row.id, "unitPrice", e.target.value)} /></td>
                    <td><input type="number" min={0} max={100} value={row.taxPercent} onChange={(e) => updateItem(row.id, "taxPercent", e.target.value)} /></td>
                    <td className="billing-num">{(row.quantity * row.unitPrice * (1 + (row.taxPercent || 0) / 100)).toFixed(2)}</td>
                    <td><button type="button" className="billing-btn billing-btn-danger-sm" onClick={() => removeRow(row.id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="billing-btn billing-btn-secondary" onClick={addRow}>+ Add row</button>
        </section>

        {/* 3. Real-time totals */}
        <section className="billing-card billing-totals">
          <h2>Summary</h2>
          <div className="billing-summary-grid">
            <div className="billing-summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="billing-summary-row"><span>Total Tax</span><span>₹{totalTax.toFixed(2)}</span></div>
            <div className="billing-summary-row">
              <span>Discount (₹)</span>
              <input type="number" min={0} value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="billing-summary-row total"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
            <div className="billing-summary-row"><span>Paid Amount (₹)</span><input type="number" min={0} value={paidAmount} onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)} /></div>
            {paymentMethod === "Insurance" && (
              <div className="billing-summary-row"><span>Insurance Covered (₹)</span><input type="number" min={0} value={insuranceCovered} onChange={(e) => setInsuranceCovered(parseFloat(e.target.value) || 0)} /></div>
            )}
            <div className="billing-summary-row"><span>Patient Payable</span><span>₹{patientPayable.toFixed(2)}</span></div>
            <div className="billing-summary-row due"><span>Due Amount</span><span>₹{dueAmount.toFixed(2)}</span></div>
          </div>
        </section>

        {/* 4. Payment */}
        <section className="billing-card">
          <h2>Payment Processing</h2>
          <div className="billing-form-row">
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => {
              setPaymentMethod(e.target.value);
              // Auto-generate a dummy UPI ref if UPI selected, else clear
              if (e.target.value === "UPI") setPaymentNotes(`UPI-${Math.random().toString(36).slice(2, 10).toUpperCase()}`);
              else setPaymentNotes("");
            }}>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {paymentMethod === "UPI" && (
            <div className="billing-upi-box" style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #e2e8f0", display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ width: "100px", height: "100px", background: "#fff", border: "2px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "bold" }}>MOCK QR</span>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>Scan via any UPI App</h4>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#475569" }}><strong>UPI ID:</strong> billing.swastik@bank</p>
                <p style={{ margin: "0", fontSize: "0.85rem", color: "#475569" }}><strong>Amount to Pay:</strong> ₹{(paymentMethod === "Insurance" ? patientPayable : dueAmount).toFixed(2)}</p>
              </div>
            </div>
          )}

          {["UPI", "Card", "Insurance"].includes(paymentMethod) && (
            <div className="billing-form-row">
              <label>Transaction / Claim Reference <span style={{ color: "red" }}>*</span></label>
              <input type="text" value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder="Enter mandatory reference ID..." />
            </div>
          )}

          {paymentMethod === "Cash" && (
            <div className="billing-form-row">
              <label>Receipt Notes (Optional)</label>
              <input type="text" value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder="Notes" />
            </div>
          )}

          {apiError && <p className="billing-error">{apiError}</p>}
          <button
            type="button"
            className="billing-btn billing-btn-primary"
            onClick={handleMarkPaid}
            disabled={["UPI", "Card", "Insurance"].includes(paymentMethod) && !paymentNotes.trim()}
          >
            Process Payment
          </button>
        </section>

        {/* 5. Invoice */}
        <section className="billing-card">
          <h2>Invoice</h2>
          <div className="billing-invoice-actions">
            <button type="button" className="billing-btn billing-btn-primary" onClick={handleGenerateInvoice}>Generate Invoice</button>
            <button type="button" className="billing-btn billing-btn-secondary" onClick={handlePrint}>Print Invoice</button>
            <button type="button" className="billing-btn billing-btn-secondary" onClick={handleDownloadPdf}>Download PDF</button>
          </div>
          <p className="billing-disclaimer">All psychiatric records are confidential. Invoice for financial purposes only.</p>
        </section>
      </main>
    </div>
  );
}

export default BillingDashboard;
