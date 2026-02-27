// Staff Directory: Updated with specific Swastik Hospital staff details.
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../implementer/implementer.css";

const SW_STAFF = [
  {
    id: 1,
    name: "Dr. P. M. Chougule",
    role: "Consultant Psychiatrist",
    department: "Psychiatry",
    contact: "M.D. Psychological Med., D.P.M. (Mumbai) M. B. F. L. P. S, M. A. P. A. (USA)"
  },
  {
    id: 2,
    name: "Dr. Nikhil Chougule",
    role: "Consultant Psychiatrist",
    department: "Psychiatry",
    contact: "M.D. Psychiatry (Mumbai), M. D. Medicine (Russia)"
  },
  {
    id: 3,
    name: "Receptionist",
    role: "Receptionist",
    department: "Front Office",
    contact: "General Inquiries"
  },
];

const DEPARTMENTS = ["All", "Psychiatry", "Front Office"];

function AdminStaff() {
  const [staff] = useState(SW_STAFF);
  const [deptFilter, setDeptFilter] = useState("All");

  const filtered = useMemo(() => {
    if (deptFilter === "All") return staff;
    return staff.filter((s) => s.department === deptFilter);
  }, [staff, deptFilter]);

  return (
    <div className="content-area impl-page">
      <Link to="/admin" className="impl-back-link">
        <FaArrowLeft /> Back to Admin
      </Link>
      <h2>Staff Directory</h2>
      <p className="section-subtitle">Official Directory of Swastik Hospital Professionals</p>

      <div className="impl-section">
        <h3>Filter</h3>
        <div className="impl-form-row">
          <label>Department</label>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} style={{ maxWidth: 240 }}>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="impl-section">
        <h3>Staff ({filtered.length})</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Degrees / Contact</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.role}</td>
                <td>{s.department}</td>
                <td style={{ fontSize: '0.9rem', color: '#555' }}>{s.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStaff;
