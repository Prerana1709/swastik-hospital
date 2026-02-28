import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  searchPatients,
  getAdmissionStatus,
  getDefaultItemsForVisitType,
  CATEGORIES,
  generateInvoiceNumber,
} from "../billingData";
import { api } from "../../../api/service";
import UPIPaymentPanel from "./UPIPaymentPanel";
import "./CreateInvoiceView.css";

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Insurance"];
const BILL_STATUS = { DRAFT: "Draft", AWAITING: "Awaiting Payment", PARTIAL: "Partially Paid", PAID: "Paid", OVERDUE: "Overdue" };

const emptyItem = () => ({
  id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  category: "Consultation",
  itemName: "",
  quantity: 1,
  unitPrice: 0,
  taxPercent: 0,
  itemDiscount: 0,
});

function getBillStatus(grandTotal, totalPaid, dueDate, isFinalized) {
  if (isFinalized) return totalPaid >= grandTotal ? BILL_STATUS.PAID : BILL_STATUS.PARTIAL;
  if (grandTotal <= 0) return BILL_STATUS.DRAFT;
  if (totalPaid >= grandTotal) return BILL_STATUS.PAID;
  if (totalPaid > 0) return BILL_STATUS.PARTIAL;
  if (dueDate) {
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (due < today) return BILL_STATUS.OVERDUE;
  }
  return BILL_STATUS.AWAITING;
}

function CreateInvoiceView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [items, setItems] = useState([emptyItem()]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [taxInclusive, setTaxInclusive] = useState(false);
  const [roundOff, setRoundOff] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [payments, setPayments] = useState([]);
  const [savedBill, setSavedBill] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isFinalized, setIsFinalized] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [paymentCompleteFlash, setPaymentCompleteFlash] = useState(false);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [issueDate] = useState(() => new Date().toISOString().slice(0, 10));

  const admissionStatus = selectedPatient ? getAdmissionStatus(selectedPatient.uhid) : null;

  const itemTotals = useMemo(() => {
    return items.map((row) => {
      const net = row.quantity * row.unitPrice - (row.itemDiscount || 0);
      const tax = taxInclusive ? 0 : (net * (row.taxPercent || 0)) / 100;
      const itemTotal = taxInclusive ? net : net + tax;
      return { ...row, net, tax, itemTotal };
    });
  }, [items, taxInclusive]);

  const subtotal = useMemo(() => itemTotals.reduce((s, r) => s + r.itemTotal, 0), [itemTotals]);
  const totalTax = useMemo(() => itemTotals.reduce((s, r) => s + r.tax, 0), [itemTotals]);
  const afterDiscount = Math.max(0, subtotal - (globalDiscount || 0));
  const grandTotalBeforeRound = afterDiscount;
  const grandTotal = Math.round((grandTotalBeforeRound + (roundOff || 0)) * 100) / 100;
  const totalPaid = useMemo(() => payments.reduce((s, p) => s + (p.amount || 0), 0), [payments]);
  const dueAmount = Math.max(0, grandTotal - totalPaid);
  const billStatus = getBillStatus(grandTotal, totalPaid, dueDate, isFinalized);
  const invoiceNumber = savedBill?.invoice_number || savedBill?.invoiceNumber || generateInvoiceNumber();
  const currentUser = localStorage.getItem("swastik_username") || "billing";
  const simulatedIp = "192.168.1.1";

  const addPayment = useCallback((entry) => {
    const newPayment = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      method: entry.method || paymentMethod,
      reference: entry.transaction_reference || entry.reference || paymentNotes,
      amount: entry.amount ?? paymentAmount,
      status: "Completed",
      createdBy: currentUser,
      timestamp: new Date().toISOString(),
      ip: simulatedIp,
    };
    setPayments((prev) => [...prev, newPayment]);
    setPaymentAmount(0);
    setPaymentNotes("");
    if (grandTotal > 0 && totalPaid + (entry.amount ?? paymentAmount) >= grandTotal) setPaymentCompleteFlash(true);
  }, [paymentMethod, paymentAmount, paymentNotes, grandTotal, totalPaid, currentUser]);

  const removePayment = useCallback((id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    if (!paymentCompleteFlash) return;
    const t = setTimeout(() => setPaymentCompleteFlash(false), 2000);
    return () => clearTimeout(t);
  }, [paymentCompleteFlash]);

  useEffect(() => {
    if (!dirty || !selectedPatient) return;
    const t = setInterval(() => {
      setSavedBill((b) => (b ? { ...b, draft: true, lastAutoSave: new Date().toISOString() } : { draft: true, patientName: selectedPatient.fullName, uhid: selectedPatient.uhid, lastAutoSave: new Date().toISOString() }));
    }, 20000);
    return () => clearInterval(t);
  }, [dirty, selectedPatient]);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (dirty && !isFinalized) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, isFinalized]);

  const handleSearch = () => setPatientSearchResults(searchPatients(searchQuery));

  const handleSelectPatient = (p) => {
    setSelectedPatient(p);
    setPatientSearchResults([]);
    setSearchQuery("");
    const visitType = (p.visitType || "opd").toLowerCase();
    const defaults = getDefaultItemsForVisitType(visitType);
    setItems(defaults.length ? defaults.map((d, i) => ({ ...emptyItem(), ...d, id: `item-${Date.now()}-${i}` })) : [emptyItem()]);
    setSavedBill(null);
    setPayments([]);
    setDirty(true);
  };

  const addRow = () => { setItems((prev) => [...prev, emptyItem()]); setDirty(true); };
  const removeRow = (id) => { setItems((prev) => prev.filter((r) => r.id !== id)); setDirty(true); };
  const updateItem = (id, field, value) => {
    setDirty(true);
    setItems((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, [field]: ["quantity", "unitPrice", "taxPercent", "itemDiscount"].includes(field) ? (typeof value === "string" ? parseFloat(value) || 0 : value) : value }
          : r
      )
    );
  };

  const handleSaveDraft = () => {
    if (!selectedPatient) return;
    setApiError(null);
    setSavedBill({ draft: true, patientName: selectedPatient.fullName, uhid: selectedPatient.uhid, invoice_number: invoiceNumber });
    setDirty(false);
  };

  const handleMarkPaid = async () => {
    if (!selectedPatient) return;
    setApiError(null);
    const createdBy = currentUser;
    const itemsForApi = itemTotals.map((r) => ({
      category: r.category,
      item_name: r.itemName,
      quantity: r.quantity,
      price: r.unitPrice,
      tax: r.tax,
      total: r.itemTotal,
    }));
    const payload = {
      patient_id: selectedPatient.uhid,
      uhid: selectedPatient.uhid,
      visit_id: null,
      admission_id: null,
      subtotal,
      tax: totalTax,
      discount: globalDiscount || 0,
      total: grandTotal,
      items: itemsForApi,
      created_by: createdBy,
    };
    try {
      let bill = await api.createBill(payload);
      for (const p of payments) {
        bill = await api.addBillPayment(bill.id, {
          amount: p.amount,
          method: p.method,
          transaction_reference: p.reference || "",
          created_by: p.createdBy || createdBy,
        });
      }
      setSavedBill({ ...bill, patientName: selectedPatient.fullName, caseNumber: selectedPatient.caseNumber });
      setIsFinalized(true);
      setDirty(false);
    } catch (err) {
      setApiError(err?.message || "Failed to save bill");
    }
  };

  const handleAddNonUpiPayment = () => {
    const amount = Number(paymentAmount) || 0;
    if (amount <= 0) return;
    addPayment({ amount, method: paymentMethod, transaction_reference: paymentNotes });
  };

  const handleUpiPaymentConfirmed = (entry) => {
    addPayment(entry);
  };

  const printStyles = "body{font-family:Segoe UI,sans-serif;padding:24px}.invoice-print table{border-collapse:collapse;width:100%;margin:16px 0}.invoice-print th,.invoice-print td{border:1px solid #ddd;padding:8px}";
  const buildInvoiceHtml = () => {
    const totalPaidCalc = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const due = grandTotal - totalPaidCalc;
    const rows = itemTotals.map((r) => `<tr><td>${r.itemName}</td><td>${r.category}</td><td>${r.quantity}</td><td>${(r.unitPrice ?? 0).toFixed(2)}</td><td>${r.taxPercent ?? ""}%</td><td>${(r.itemTotal ?? 0).toFixed(2)}</td></tr>`).join("");
    return `<div class="invoice-print"><h1>Swastik Psychiatric Hospital</h1><p>GST: 27AABCU9603R1ZM</p><p><strong>Invoice No:</strong> ${invoiceNumber}</p><p><strong>Patient:</strong> ${selectedPatient?.fullName} | UHID: ${selectedPatient?.uhid}</p><table><thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Tax %</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><p>Subtotal: ₹${subtotal.toFixed(2)} | Tax: ₹${totalTax.toFixed(2)} | Discount: ₹${(globalDiscount || 0).toFixed(2)} | <strong>Grand Total: ₹${grandTotal.toFixed(2)}</strong></p><p>Paid: ₹${totalPaidCalc.toFixed(2)} | Due: ₹${due.toFixed(2)}</p><p><em>All psychiatric records are confidential.</em></p><p>Authorized signature: _________________________</p></div>`;
  };
  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Invoice</title><style>${printStyles}</style></head><body>${buildInvoiceHtml()}</body></html>`);
    w.document.close();
    w.print();
    w.close();
  };

  const statusClass = {
    [BILL_STATUS.DRAFT]: "create-invoice-status--draft",
    [BILL_STATUS.AWAITING]: "create-invoice-status--awaiting",
    [BILL_STATUS.PARTIAL]: "create-invoice-status--partial",
    [BILL_STATUS.PAID]: "create-invoice-status--paid",
    [BILL_STATUS.OVERDUE]: "create-invoice-status--overdue",
  };

  return (
    <div className="billing-content create-invoice-page">
      {paymentCompleteFlash && <div className="create-invoice-flash" aria-live="polite">Payment completed</div>}

      <div className="billing-card create-invoice-card">
        <div className="create-invoice-status-row">
          <span className="create-invoice-status-label">Invoice status</span>
          <span className={`create-invoice-status-badge ${statusClass[billStatus] || ""}`}>{billStatus}</span>
        </div>

        <h2 className="billing-card__heading">Create Invoice</h2>
        <div className="billing-form-row">
          <label>Patient</label>
          <div className="billing-search-row">
            <input type="text" placeholder="Search by UHID, Name, or Phone" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} disabled={isFinalized} />
            <button type="button" className="billing-btn billing-btn--primary" onClick={handleSearch} disabled={isFinalized}>Search</button>
          </div>
          {patientSearchResults.length > 0 && (
            <div className="billing-dropdown">
              {patientSearchResults.map((p) => (
                <button type="button" key={p.uhid} className="billing-dropdown-item" onClick={() => handleSelectPatient(p)}>{p.uhid} – {p.fullName} – {p.contact}</button>
              ))}
            </div>
          )}
          {selectedPatient && (
            <div className="billing-patient-info">
              <p><strong>UHID:</strong> {selectedPatient.uhid} | <strong>Name:</strong> {selectedPatient.fullName}</p>
              <p><strong>Visit:</strong> {selectedPatient.visitType || "OPD"} {selectedPatient.riskFlag && "| High Risk"} {admissionStatus && `| Admission: ${admissionStatus.status}`}</p>
              <p><strong>Issue date:</strong> {issueDate} | <strong>Due date:</strong> <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="create-invoice-date" disabled={isFinalized} /></p>
            </div>
          )}
        </div>

        <div className="billing-form-row">
          <label>Items</label>
          <div className="billing-table-wrap">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit Price (₹)</th>
                  <th>Tax %</th>
                  <th>Item Disc. (₹)</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {itemTotals.map((row) => (
                  <tr key={row.id}>
                    <td><input type="text" value={row.itemName} onChange={(e) => updateItem(row.id, "itemName", e.target.value)} placeholder="Item" disabled={isFinalized} /></td>
                    <td>
                      <select value={row.category} onChange={(e) => updateItem(row.id, "category", e.target.value)} disabled={isFinalized}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td><input type="number" min={1} value={row.quantity} onChange={(e) => updateItem(row.id, "quantity", e.target.value)} disabled={isFinalized} /></td>
                    <td><input type="number" min={0} step={0.01} value={row.unitPrice} onChange={(e) => updateItem(row.id, "unitPrice", e.target.value)} disabled={isFinalized} /></td>
                    <td><input type="number" min={0} max={100} value={row.taxPercent} onChange={(e) => updateItem(row.id, "taxPercent", e.target.value)} disabled={isFinalized} /></td>
                    <td><input type="number" min={0} value={row.itemDiscount || 0} onChange={(e) => updateItem(row.id, "itemDiscount", e.target.value)} disabled={isFinalized} /></td>
                    <td className="billing-table__total">{row.itemTotal.toFixed(2)}</td>
                    <td>{!isFinalized && <button type="button" className="billing-btn billing-btn--danger billing-btn--sm" onClick={() => removeRow(row.id)}>Remove</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isFinalized && <button type="button" className="billing-btn billing-btn--secondary" onClick={addRow}>+ Add Item</button>}
        </div>

        <div className="billing-summary-inline create-invoice-totals">
          <div className="billing-summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="billing-summary-row"><span>Tax</span><span>₹{totalTax.toFixed(2)}</span></div>
          <div className="billing-summary-row">
            <span>Tax inclusive</span>
            <input type="checkbox" checked={taxInclusive} onChange={(e) => { setTaxInclusive(e.target.checked); setDirty(true); }} disabled={isFinalized} />
          </div>
          <div className="billing-summary-row">
            <span>Global discount (₹)</span>
            <input type="number" min={0} value={globalDiscount} onChange={(e) => { setGlobalDiscount(parseFloat(e.target.value) || 0); setDirty(true); }} style={{ width: "100px" }} disabled={isFinalized} />
          </div>
          <div className="billing-summary-row">
            <span>Round off (₹)</span>
            <input type="number" step={0.01} value={roundOff} onChange={(e) => { setRoundOff(parseFloat(e.target.value) || 0); setDirty(true); }} style={{ width: "100px" }} disabled={isFinalized} />
          </div>
          <div className="billing-summary-row billing-summary-row--grand"><span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
          <div className="billing-summary-row"><span>Total Paid</span><span>₹{totalPaid.toFixed(2)}</span></div>
          <div className="billing-summary-row"><span>Due</span><span>₹{dueAmount.toFixed(2)}</span></div>
        </div>

        <div className="create-invoice-payment-section">
          <h3 className="create-invoice-payment-title">Payment</h3>
          <div className="create-invoice-payment-card">
            {paymentMethod === "UPI" ? (
              <UPIPaymentPanel
                amount={dueAmount > 0 ? dueAmount : grandTotal}
                invoiceNumber={invoiceNumber}
                onPaymentConfirmed={handleUpiPaymentConfirmed}
                disabled={isFinalized}
              />
            ) : (
              <>
                <div className="billing-form-row">
                  <label>Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={isFinalized}>
                    {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="billing-form-row">
                  <label>{paymentMethod === "Insurance" ? "Insurance amount (₹)" : "Amount (₹)"}</label>
                  <input type="number" min={0} step={0.01} value={paymentAmount} onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)} disabled={isFinalized} />
                </div>
                <div className="billing-form-row">
                  <label>Reference / Notes</label>
                  <input type="text" value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder="UTR / reference" disabled={isFinalized} />
                </div>
                <button type="button" className="billing-btn billing-btn--secondary" onClick={handleAddNonUpiPayment} disabled={isFinalized}>Add Payment</button>
              </>
            )}
          </div>

          {payments.length > 0 && (
            <div className="create-invoice-payment-history">
              <h4>Payment history</h4>
              <div className="billing-table-wrap">
                <table className="billing-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Method</th>
                      <th>Reference</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>User</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td>{p.date}</td>
                        <td>{p.method}</td>
                        <td>{p.reference || "—"}</td>
                        <td>₹{(p.amount || 0).toFixed(2)}</td>
                        <td>{p.status}</td>
                        <td><span className="create-invoice-audit">{p.createdBy}</span> {p.timestamp && <span className="create-invoice-audit-time" title={p.timestamp}>•</span>}</td>
                        <td>{!isFinalized && <button type="button" className="billing-btn billing-btn--danger billing-btn--sm" onClick={() => removePayment(p.id)}>Remove</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {apiError && <p className="billing-payment__error">{apiError}</p>}
        <div className="billing-create-actions">
          {!isFinalized && <button type="button" className="billing-btn billing-btn--secondary" onClick={handleSaveDraft}>Save Draft</button>}
          <button type="button" className="billing-btn billing-btn--secondary" onClick={() => setShowReceiptPreview(!showReceiptPreview)}>Receipt preview</button>
          <button type="button" className="billing-btn billing-btn--secondary" onClick={handlePrint}>Print</button>
          {!isFinalized && <button type="button" className="billing-btn billing-btn--primary" onClick={handleMarkPaid}>Finalize & Mark Paid</button>}
        </div>
        {showReceiptPreview && (
          <div className="create-invoice-receipt-preview" dangerouslySetInnerHTML={{ __html: buildInvoiceHtml() }} />
        )}
        {savedBill && <p className="billing-card__muted">Bill saved. {savedBill.invoice_number || savedBill.invoiceNumber || "Draft saved."} {savedBill.lastAutoSave && "(Auto-saved)"}</p>}
        {isFinalized && <p className="create-invoice-locked">Invoice locked.</p>}
      </div>
    </div>
  );
}

export default CreateInvoiceView;
