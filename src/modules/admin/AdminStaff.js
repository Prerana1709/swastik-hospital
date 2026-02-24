// Staff Directory: table of staff, filter by department. Local state + mock data.
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../implementer/implementer.css";

const MOCK_STAFF = [
  { id: 1, name: "Dr. P. M. Chougule", role: "Consultant", department: "Psychiatry", contact: "(0231) 2658835" },
  { id: 2, name: "Dr. Priya Sharma", role: "Resident", department: "General Medicine", contact: "9876543211" },
  { id: 3, name: "Anita Desai", role: "Nurse", department: "Cardiology", contact: "9876543212" },
  { id: 4, name: "Vikram Singh", role: "Lab Technician", department: "Lab", contact: "9876543213" },
  { id: 5, name: "Meera Iyer", role: "Receptionist", department: "Billing", contact: "9876543214" },
  { id: 6, name: "Dr. Amit Patel", role: "Consultant", department: "Emergency", contact: "9876543215" },
];

const DEPARTMENTS = ["All", ...new Set(MOCK_STAFF.map((s) => s.department))];

function AdminStaff() {
  const [staff] = useState(MOCK_STAFF);
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
      <p className="section-subtitle">View staff; filter by department</p>

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
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.role}</td>
                <td>{s.department}</td>
                <td>{s.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStaff;
