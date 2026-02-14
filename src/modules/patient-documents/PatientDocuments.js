// Patient Documents: search, upload modal (drag-drop, preview), table, filters, View/Download/Print/Delete.
import React, { useState, useMemo } from "react";
import "../implementer/implementer.css";
import "./PatientDocuments.css";

const CATEGORIES = ["Prescription", "Lab Report", "X-Ray", "Discharge Summary", "Consent Form", "Referral", "Other"];

const MOCK_PATIENT = {
  uhid: "UHID-2025-001",
  name: "Ramesh Kumar",
  age: 45,
  gender: "Male",
  phone: "9876543210",
  lastVisit: "2025-02-01",
};

function PatientDocuments() {
  const [uhid, setUhid] = useState("");
  const [patientName, setPatientName] = useState("");
  const [searched, setSearched] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [docForm, setDocForm] = useState({
    documentName: "",
    category: "Prescription",
    notes: "",
    uploadedBy: "Dr. Rajesh Kumar",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentName: "Blood Report",
      category: "Lab Report",
      uploadedBy: "Dr. Sharma",
      date: "2025-02-05",
      fileType: "PDF",
      fileName: "blood_report.pdf",
      fileObjectUrl: null,
    },
    {
      id: 2,
      documentName: "Chest X-Ray",
      category: "X-Ray",
      uploadedBy: "Lab Tech",
      date: "2025-02-04",
      fileType: "Image",
      fileName: "xray.png",
      fileObjectUrl: null,
    },
  ]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortByDate, setSortByDate] = useState("newest");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  const filteredAndSortedDocs = useMemo(() => {
    let list = documents.filter(
      (d) => categoryFilter === "All" || d.category === categoryFilter
    );
    list = [...list].sort((a, b) => {
      if (sortByDate === "newest") return new Date(b.date) - new Date(a.date);
      return new Date(a.date) - new Date(b.date);
    });
    return list;
  }, [documents, categoryFilter, sortByDate]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    const url = URL.createObjectURL(file);
    setFilePreviewUrl(url);
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleSaveDocument = (e) => {
    e.preventDefault();
    if (!docForm.documentName.trim()) return;
    const fileType = selectedFile
      ? (selectedFile.type.startsWith("image/") ? "Image" : "PDF")
      : "—";
    const fileName = selectedFile ? selectedFile.name : "—";
    const newDoc = {
      id: Date.now(),
      documentName: docForm.documentName.trim(),
      category: docForm.category,
      uploadedBy: docForm.uploadedBy.trim() || "—",
      date: new Date().toISOString().slice(0, 10),
      fileType,
      fileName,
      fileObjectUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
    };
    setDocuments((prev) => [...prev, newDoc]);
    setDocForm({ documentName: "", category: "Prescription", notes: "", uploadedBy: "Dr. Rajesh Kumar" });
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setSelectedFile(null);
    setUploadModalOpen(false);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setSelectedFile(null);
  };

  const handleView = (doc) => {
    setViewDoc(doc);
    setViewModalOpen(true);
  };

  const handleDownload = (doc) => {
    if (doc.fileObjectUrl) {
      const a = document.createElement("a");
      a.href = doc.fileObjectUrl;
      a.download = doc.fileName || doc.documentName;
      a.click();
    }
  };

  const handlePrint = (doc) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const isImage = doc.fileType === "Image" && doc.fileObjectUrl;
    const isPdf = doc.fileType === "PDF" && doc.fileObjectUrl;
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>${doc.documentName}</title></head><body style="margin:1rem;font-family:Segoe UI,sans-serif;">
      <h2>${doc.documentName}</h2>
      <p><strong>Category:</strong> ${doc.category} | <strong>Uploaded by:</strong> ${doc.uploadedBy} | <strong>Date:</strong> ${doc.date}</p>
      ${isImage ? `<img src="${doc.fileObjectUrl}" style="max-width:100%;height:auto;" alt="Document" />` : ""}
      ${isPdf ? `<iframe src="${doc.fileObjectUrl}" style="width:100%;height:90vh;border:0;"></iframe>` : ""}
      ${!isImage && !isPdf ? `<p>No file preview available. File: ${doc.fileName}</p>` : ""}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const handleDeleteClick = (doc) => setDeleteConfirm(doc);

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.fileObjectUrl) URL.revokeObjectURL(deleteConfirm.fileObjectUrl);
    setDocuments((prev) => prev.filter((d) => d.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  const categoriesForFilter = ["All", ...CATEGORIES];

  return (
    <div className="content-area pdoc-page">
      {/* Patient Search */}
      <div className="pdoc-section pdoc-search-section">
        <h3>Patient Search</h3>
        <form onSubmit={handleSearch} className="pdoc-search-form">
          <div className="pdoc-form-row">
            <label>UHID</label>
            <input
              type="text"
              value={uhid}
              onChange={(e) => setUhid(e.target.value)}
              placeholder="Enter UHID"
            />
          </div>
          <div className="pdoc-form-row">
            <label>Patient Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Patient name"
            />
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">Search</button>
        </form>
        {searched && (
          <div className="pdoc-patient-card">
            <h4>Patient Summary</h4>
            <p><strong>UHID:</strong> {MOCK_PATIENT.uhid}</p>
            <p><strong>Name:</strong> {MOCK_PATIENT.name}</p>
            <p><strong>Age / Gender:</strong> {MOCK_PATIENT.age} / {MOCK_PATIENT.gender}</p>
            <p><strong>Phone:</strong> {MOCK_PATIENT.phone}</p>
            <p><strong>Last Visit:</strong> {MOCK_PATIENT.lastVisit}</p>
          </div>
        )}
      </div>

      {/* Toolbar: Upload button + Filters */}
      <div className="pdoc-toolbar">
        <div className="pdoc-filters">
          <div className="pdoc-form-row">
            <label>Category</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {categoriesForFilter.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="pdoc-form-row">
            <label>Sort by Date</label>
            <select value={sortByDate} onChange={(e) => setSortByDate(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          className="impl-btn impl-btn-primary pdoc-upload-btn"
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Document
        </button>
      </div>

      {/* Documents Table */}
      <div className="pdoc-section">
        <h3>Documents</h3>
        <div className="pdoc-table-wrap">
          <table className="impl-table pdoc-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Category</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>File Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="pdoc-empty">No documents found</td>
                </tr>
              ) : (
                filteredAndSortedDocs.map((doc) => (
                  <tr key={doc.id} className="pdoc-row-print" data-doc-id={doc.id}>
                    <td>{doc.documentName}</td>
                    <td>{doc.category}</td>
                    <td>{doc.uploadedBy}</td>
                    <td>{doc.date}</td>
                    <td>{doc.fileType}</td>
                    <td className="pdoc-actions">
                      <button type="button" className="pdoc-action-btn" onClick={() => handleView(doc)} title="View">View</button>
                      <button type="button" className="pdoc-action-btn" onClick={() => handleDownload(doc)} title="Download">Download</button>
                      <button type="button" className="pdoc-action-btn" onClick={() => handlePrint(doc)} title="Print">Print</button>
                      <button type="button" className="pdoc-action-btn pdoc-action-delete" onClick={() => handleDeleteClick(doc)} title="Delete">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="pdoc-modal-overlay" onClick={closeUploadModal}>
          <div className="pdoc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdoc-modal-header">
              <h3>Upload Document</h3>
              <button type="button" className="pdoc-modal-close" onClick={closeUploadModal} aria-label="Close">&times;</button>
            </div>
            <form onSubmit={handleSaveDocument}>
              <div className="pdoc-form-row">
                <label>Document Name</label>
                <input
                  type="text"
                  value={docForm.documentName}
                  onChange={(e) => setDocForm((f) => ({ ...f, documentName: e.target.value }))}
                  placeholder="Document name"
                  required
                />
              </div>
              <div className="pdoc-form-row">
                <label>Category</label>
                <select
                  value={docForm.category}
                  onChange={(e) => setDocForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="pdoc-form-row">
                <label>File</label>
                <div
                  className={`pdoc-dropzone ${dragOver ? "pdoc-dropzone-active" : ""}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById("pdoc-file-input").click()}
                >
                  <input
                    id="pdoc-file-input"
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />
                  {selectedFile ? (
                    <span className="pdoc-dropzone-file">{selectedFile.name}</span>
                  ) : (
                    <span>Drag & drop file here or click to browse (image/PDF)</span>
                  )}
                </div>
              </div>
              {filePreviewUrl && (
                <div className="pdoc-form-row">
                  <label>Preview</label>
                  <div className="pdoc-preview">
                    {selectedFile?.type?.startsWith("image/") ? (
                      <img src={filePreviewUrl} alt="Preview" />
                    ) : (
                      <iframe title="PDF preview" src={filePreviewUrl} />
                    )}
                  </div>
                </div>
              )}
              <div className="pdoc-form-row">
                <label>Notes</label>
                <textarea
                  value={docForm.notes}
                  onChange={(e) => setDocForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Optional notes"
                  rows={2}
                />
              </div>
              <div className="pdoc-form-row">
                <label>Uploaded By</label>
                <input
                  type="text"
                  value={docForm.uploadedBy}
                  onChange={(e) => setDocForm((f) => ({ ...f, uploadedBy: e.target.value }))}
                  placeholder="Name"
                />
              </div>
              <div className="pdoc-modal-footer">
                <button type="button" className="impl-btn impl-btn-secondary" onClick={closeUploadModal}>Cancel</button>
                <button type="submit" className="impl-btn impl-btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && viewDoc && (
        <div className="pdoc-modal-overlay" onClick={() => setViewModalOpen(false)}>
          <div className="pdoc-modal pdoc-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdoc-modal-header">
              <h3>{viewDoc.documentName}</h3>
              <button type="button" className="pdoc-modal-close" onClick={() => setViewModalOpen(false)} aria-label="Close">&times;</button>
            </div>
            <p className="pdoc-view-meta">{viewDoc.category} | {viewDoc.uploadedBy} | {viewDoc.date}</p>
            <div className="pdoc-preview pdoc-view-preview">
              {viewDoc.fileObjectUrl && viewDoc.fileType === "Image" && (
                <img src={viewDoc.fileObjectUrl} alt={viewDoc.documentName} />
              )}
              {viewDoc.fileObjectUrl && viewDoc.fileType === "PDF" && (
                <iframe title={viewDoc.documentName} src={viewDoc.fileObjectUrl} />
              )}
              {(!viewDoc.fileObjectUrl || (viewDoc.fileType !== "Image" && viewDoc.fileType !== "PDF")) && (
                <p>No preview available for this file.</p>
              )}
            </div>
            <div className="pdoc-modal-footer">
              <button type="button" className="impl-btn impl-btn-secondary" onClick={() => setViewModalOpen(false)}>Close</button>
              <button type="button" className="impl-btn impl-btn-primary" onClick={() => { handleDownload(viewDoc); setViewModalOpen(false); }}>Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="pdoc-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="pdoc-modal pdoc-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Document</h3>
            <p>Are you sure you want to delete &quot;{deleteConfirm.documentName}&quot;? This cannot be undone.</p>
            <div className="pdoc-modal-footer">
              <button type="button" className="impl-btn impl-btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button type="button" className="impl-btn impl-btn-primary pdoc-delete-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDocuments;
