// Lab orders queue with status engine and tabs. Tabs filter by status; View routes by status.
import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./lab.css";

// Status engine: ORDERED, SAMPLE_COLLECTED, IN_TEST, VERIFIED, REPORTED, CRITICAL
const STATUS = {
  ORDERED: "ORDERED",
  SAMPLE_COLLECTED: "SAMPLE_COLLECTED",
  IN_TEST: "IN_TEST",
  VERIFIED: "VERIFIED",
  REPORTED: "REPORTED",
  CRITICAL: "CRITICAL",
};

const TABS = [
  { id: "pending", label: "Pending Samples", statuses: [STATUS.ORDERED] },
  { id: "collected", label: "Samples Collected", statuses: [STATUS.SAMPLE_COLLECTED] },
  { id: "inprogress", label: "In Progress", statuses: [STATUS.IN_TEST] },
  { id: "ready", label: "Reports Ready", statuses: [STATUS.VERIFIED, STATUS.REPORTED] },
  { id: "critical", label: "Critical Results", statuses: [STATUS.CRITICAL] },
];

const MOCK_ORDERS = [
  { orderId: "ORD-001", patientName: "Ramesh Patil", uhid: "UHID-2024-001", tests: "CBC, RBS", source: "OPD", priority: "Normal", status: STATUS.ORDERED },
  { orderId: "ORD-002", patientName: "Sunita Kulkarni", uhid: "UHID-2024-002", tests: "LFT, KFT", source: "IPD", priority: "Urgent", status: STATUS.SAMPLE_COLLECTED },
  { orderId: "ORD-003", patientName: "Amit Joshi", uhid: "UHID-2024-003", tests: "HbA1c", source: "OPD", priority: "Normal", status: STATUS.REPORTED },
  { orderId: "ORD-004", patientName: "Priya Sharma", uhid: "UHID-2024-004", tests: "CBC, Urine", source: "Emergency", priority: "Urgent", status: STATUS.ORDERED },
  { orderId: "ORD-005", patientName: "Vikram Singh", uhid: "UHID-2024-005", tests: "Serum K", source: "IPD", priority: "Urgent", status: STATUS.IN_TEST },
  { orderId: "ORD-006", patientName: "Meera Reddy", uhid: "UHID-2024-006", tests: "Troponin", source: "Emergency", priority: "Urgent", status: STATUS.CRITICAL },
];

function StatusBadge({ status }) {
  return <span className={"lab-status-badge lab-status-" + status}>{status.replace(/_/g, " ")}</span>;
}

function LabOrders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");

  const allowedStatuses = useMemo(() => TABS.find((t) => t.id === activeTab)?.statuses || [], [activeTab]);
  const filteredOrders = useMemo(
    () => MOCK_ORDERS.filter((o) => allowedStatuses.includes(o.status)),
    [allowedStatuses]
  );

  const handleView = (order) => {
    if (order.status === STATUS.ORDERED) {
      navigate("/lab/collect/" + order.orderId);
    } else {
      navigate("/lab/result/" + order.orderId);
    }
  };

  return (
    <div className="content-area lab-page">
      <Link to="/lab" className="lab-back-link">
        <FaArrowLeft /> Back to Lab
      </Link>
      <div className="lab-orders-header">
        <div>
          <h2>Lab Orders Queue</h2>
          <p className="section-subtitle">View and act on orders by status</p>
        </div>
        <button type="button" className="lab-btn lab-btn-primary" onClick={() => navigate("/lab/new-sample")}>
          + Add New Sample
        </button>
      </div>

      <div className="lab-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={"lab-tab " + (activeTab === tab.id ? "active" : "")}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="lab-section">
        <table className="lab-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Patient Name</th>
              <th>UHID</th>
              <th>Tests Ordered</th>
              <th>Source</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8}>No orders in this category.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.patientName}</td>
                  <td>{order.uhid}</td>
                  <td>{order.tests}</td>
                  <td>{order.source}</td>
                  <td>{order.priority}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>
                    <button type="button" className="lab-btn lab-btn-secondary" onClick={() => handleView(order)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LabOrders;
