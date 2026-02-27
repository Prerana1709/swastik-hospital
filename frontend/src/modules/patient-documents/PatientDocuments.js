// Psychiatric Patient Records: confidentiality notice, psychiatric categories, risk level, therapist, filters, View/Download/Print.
import React, { useState, useMemo, useRef } from "react";
import "../implementer/implementer.css";
import "./PatientDocuments.css";
import { api } from "../../api/service";

const CATEGORIES = [
  "Psychiatric Assessment",
  "Risk Assessment",
  "Therapy Notes",
  "Medication Monitoring",
  "Legal Documents",
  "Consent Forms",
  "Rehabilitation Records",
];

const RISK_LEVELS = ["Low", "Moderate", "High"];
const THERAPISTS = ["Dr. P. M. Chougule", "Dr. Priya Sharma", "Dr. Suresh Nair", "Dr. Anjali Patel"];

function PatientDocuments() {
  const [uhidInput, setUhidInput] = useState("");
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [docForm, setDocForm] = useState({
    documentName: "",
    category: CATEGORIES[0],
    riskLevel: "Low",
    uploadedBy: "Dr. P. M. Chougule",
    therapist: "Dr. P. M. Chougule",
    confidential: true,
    notes: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [filterRisk, setFilterRisk] = useState("All");
  const [filterTherapist, setFilterTherapist] = useState("All");

  const filteredAndSortedDocs = useMemo(() => {
    let list = documents.filter((d) => {
      if (filterRisk !== "All" && d.risk_level !== filterRisk) return false;
      if (filterTherapist !== "All" && d.therapist !== filterTherapist) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const dateA = a.uploaded_at || a.date;
      const dateB = b.uploaded_at || b.date;
      return new Date(dateB) - new Date(dateA);
    });
    return list;
  }, [documents, filterRisk, filterTherapist]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!uhidInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPatientRecord(uhidInput.trim());
      setPatient(res.patient);
      setDocuments(res.documents);
    } catch (err) {
      setError(err.message);
      setPatient(null);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    const url = URL.createObjectURL(file);
    setFilePreviewUrl(url);
    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    if (!docForm.documentName.trim() || !patient) return;

    setLoading(true);
    try {
      let base64Data = null;
      let fileType = "—";
      let fileName = "—";

      if (selectedFile) {
        base64Data = await fileToBase64(selectedFile);
        fileType = selectedFile.type.startsWith("image/") ? "Image" : "PDF";
        fileName = selectedFile.name;
      }

      const payload = {
        document_name: docForm.documentName.trim(),
        category: docForm.category,
        risk_level: docForm.riskLevel,
        uploaded_by: docForm.uploadedBy.trim() || "—",
        therapist: docForm.therapist || "—",
        confidential: docForm.confidential,
        notes: docForm.notes,
        file_type: fileType,
        file_name: fileName,
        file_data: base64Data
      };

      const newDoc = await api.addPatientDocument(patient.uhid, payload);
      setDocuments((prev) => [newDoc, ...prev]);
      closeUploadModal();
    } catch (err) {
      alert("Failed to save document: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setSelectedFile(null);
    setDocForm({
      documentName: "",
      category: CATEGORIES[0],
      riskLevel: "Low",
      uploadedBy: "Dr. P. M. Chougule",
      therapist: "Dr. P. M. Chougule",
      confidential: true,
      notes: "",
    });
  };

  const handleView = (doc) => {
    if (doc.file_data) {
      const win = window.open();
      if (win) {
        if (doc.file_type === "PDF") {
          win.document.write(`<iframe src="${doc.file_data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
          win.document.write(`<img src="${doc.file_data}" style="max-width:100%;" />`);
        }
      }
    } else {
      setViewDoc(doc);
      setViewModalOpen(true);
    }
  };

  const handleDownload = (doc) => {
    if (!doc.file_data) {
      alert("No file data available for download.");
      return;
    }
    const link = document.createElement("a");
    link.href = doc.file_data;
    link.download = doc.file_name || doc.document_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (doc) => {
    if (!doc.file_data) {
      // Print metadata view
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to print.");
        return;
      }
      printWindow.document.write(`
        <html><head><title>Print Document</title></head>
        <body style="padding:20px; font-family: sans-serif;">
          <h2 style="text-align:center; border-bottom:1px solid #eee; padding-bottom:10px;">${doc.document_name}</h2>
          <div style="margin:20px 0;">
              <p><strong>Category:</strong> ${doc.category}</p>
              <p><strong>Risk Level:</strong> ${doc.risk_level}</p>
              <p><strong>Date:</strong> ${doc.uploaded_at ? doc.uploaded_at.slice(0, 10) : "N/A"}</p>
              <p><strong>Uploaded By:</strong> ${doc.uploaded_by}</p>
          </div>
          <hr/>
          <div style="margin-top:20px;">
              <h4>Notes:</h4>
              <p style="white-space: pre-wrap;">${doc.notes || "No additional notes."}</p>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body></html>
      `);
      printWindow.document.close();
      return;
    }

    // For PDF files, the most robust way to print is to open them in a tab.
    // Modern browsers include a print button in the PDF viewer.
    // Trying to programmatically trigger .print() on an iframe with Data URI src 
    // often causes SecurityErrors (CORS/Cross-Origin restrictions).
    if (doc.file_type === "PDF") {
      const win = window.open(doc.file_data, "_blank");
      if (!win) alert("Please allow popups to view/print PDFs.");
      return;
    }

    // For Image files, we can write the image to a same-origin window and trigger print.
    if (doc.file_type === "Image") {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to print.");
        return;
      }
      printWindow.document.write(`
        <html><head><title>Print ${doc.document_name}</title></head>
        <body style="margin:0; display:flex; justify-content:center; align-items:center;">
            <img src="${doc.file_data}" style="max-width:100%; max-height:100%;" onload="window.print(); window.close();" />
        </body></html>
      `);
      printWindow.document.close();
      return;
    }
  };

  const handleDeleteClick = (doc) => setDeleteConfirm(doc);

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.deletePatientDocument(deleteConfirm._id);
      setDocuments((prev) => prev.filter((d) => d._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="content-area pdoc-page pdoc-page-psych">
      <div className="pdoc-confidentiality">
        All psychiatric records are confidential under Mental Health Act guidelines.
      </div>

      <div className="pdoc-section pdoc-search-section">
        <h3>Patient Search</h3>
        <form onSubmit={handleSearch} className="pdoc-search-form">
          <div className="pdoc-form-row">
            <label>UHID</label>
            <input
              type="text"
              value={uhidInput}
              onChange={(e) => setUhidInput(e.target.value)}
              placeholder="Enter UHID (e.g. UHID-001)"
              required
            />
          </div>
          <button type="submit" className="impl-btn impl-btn-primary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
        {patient && (
          <div className="pdoc-patient-card">
            <h4>Patient Profile</h4>
            <div className="pdoc-card-grid">
              <p><strong>UHID:</strong> {patient.uhid}</p>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Age/Gender:</strong> {patient.age} / {patient.gender}</p>
              <p><strong>Phone:</strong> {patient.phone}</p>
            </div>
          </div>
        )}
      </div>

      {patient && (
        <>
          <div className="pdoc-toolbar">
            <div className="pdoc-filters">
              <div className="pdoc-form-row">
                <label>Risk Level</label>
                <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                  <option value="All">All</option>
                  {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="pdoc-form-row">
                <label>Therapist</label>
                <select value={filterTherapist} onChange={(e) => setFilterTherapist(e.target.value)}>
                  <option value="All">All</option>
                  {THERAPISTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <button
                type="button"
                className="impl-btn impl-btn-primary"
                onClick={() => setUploadModalOpen(true)}
              >
                Add Document
              </button>
            </div>
          </div>

          <div className="pdoc-section">
            <div className="pdoc-table-wrap">
              <table className="impl-table pdoc-table">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Category</th>
                    <th>Risk Level</th>
                    <th>Uploaded By</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="pdoc-empty">No documents found for this patient.</td>
                    </tr>
                  ) : (
                    filteredAndSortedDocs.map((doc) => (
                      <tr key={doc._id} className={doc.risk_level === "High" ? "pdoc-row-sensitive" : ""}>
                        <td>{doc.document_name}</td>
                        <td>{doc.category}</td>
                        <td>
                          <span className={`pdoc-risk-badge pdoc-risk-${doc.risk_level.toLowerCase()}`}>
                            {doc.risk_level}
                          </span>
                        </td>
                        <td>{doc.uploaded_by}</td>
                        <td>{doc.uploaded_at ? doc.uploaded_at.slice(0, 10) : "N/A"}</td>
                        <td className="pdoc-actions">
                          <button className="pdoc-action-btn" onClick={() => handleView(doc)}>View</button>
                          <button className="pdoc-action-btn" onClick={() => handleDownload(doc)}>Download</button>
                          <button className="pdoc-action-btn" onClick={() => handlePrint(doc)}>Print</button>
                          <button className="pdoc-action-btn pdoc-action-delete" onClick={() => handleDeleteClick(doc)}>Remove</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {uploadModalOpen && (
        <div className="pdoc-modal-overlay" onClick={closeUploadModal}>
          <div className="pdoc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdoc-modal-header">
              <h3>Add Psychiatric Document</h3>
              <button type="button" className="pdoc-modal-close" onClick={closeUploadModal}>&times;</button>
            </div>
            <form onSubmit={handleSaveDocument}>
              <div className="pdoc-form-row">
                <label>Document Name</label>
                <input
                  type="text"
                  value={docForm.documentName}
                  onChange={(e) => setDocForm((f) => ({ ...f, documentName: e.target.value }))}
                  required
                />
              </div>
              <div className="pdoc-form-row">
                <label>Category</label>
                <select
                  value={docForm.category}
                  onChange={(e) => setDocForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="pdoc-form-row">
                <label>Risk Level</label>
                <select
                  value={docForm.riskLevel}
                  onChange={(e) => setDocForm((f) => ({ ...f, riskLevel: e.target.value }))}
                >
                  {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="pdoc-form-row">
                <label>File Upload</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                />
                <div
                  className="pdoc-file-dropzone"
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    border: '2px dashed #ccc',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    background: selectedFile ? '#f0f9ff' : '#fafafa'
                  }}
                >
                  {selectedFile ? (
                    <p style={{ color: '#0369a1' }}>Selected: {selectedFile.name}</p>
                  ) : (
                    <p>Click or drag file to upload (Image/PDF)</p>
                  )}
                </div>
              </div>
              <div className="pdoc-form-row">
                <label>Therapist (Attending)</label>
                <select
                  value={docForm.therapist}
                  onChange={(e) => setDocForm((f) => ({ ...f, therapist: e.target.value }))}
                >
                  {THERAPISTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="pdoc-form-row">
                <label>Notes</label>
                <textarea
                  value={docForm.notes}
                  onChange={(e) => setDocForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="pdoc-modal-footer">
                <button type="button" className="impl-btn impl-btn-secondary" onClick={closeUploadModal}>Cancel</button>
                <button type="submit" className="impl-btn impl-btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewModalOpen && viewDoc && (
        <div className="pdoc-modal-overlay" onClick={() => setViewModalOpen(false)}>
          <div className="pdoc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdoc-modal-header">
              <h3>{viewDoc.document_name}</h3>
              <button type="button" className="pdoc-modal-close" onClick={() => setViewModalOpen(false)}>&times;</button>
            </div>
            <div className="pdoc-view-content">
              <p><strong>Category:</strong> {viewDoc.category}</p>
              <p><strong>Risk Level:</strong> {viewDoc.risk_level}</p>
              <p><strong>Therapist:</strong> {viewDoc.therapist}</p>
              <p><strong>Uploaded By:</strong> {viewDoc.uploaded_by}</p>
              <p><strong>Date:</strong> {viewDoc.uploaded_at ? viewDoc.uploaded_at.slice(0, 10) : "N/A"}</p>
              <p><strong>Notes:</strong> {viewDoc.notes || "None"}</p>
            </div>
            <div className="pdoc-modal-footer">
              <button className="impl-btn impl-btn-secondary" onClick={() => setViewModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="pdoc-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="pdoc-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Remove Document?</h3>
            <p>Are you sure you want to remove "{deleteConfirm.document_name}"?</p>
            <div className="pdoc-modal-footer">
              <button className="impl-btn impl-btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="impl-btn impl-btn-primary" onClick={confirmDelete}>Confirm Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDocuments;
