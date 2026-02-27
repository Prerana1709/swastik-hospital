// Lab orders queue with live status engine and backend integration.
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaSync } from "react-icons/fa";
import "./lab.css";
import { api } from "../../api/service";

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
  { id: "all", label: "All Orders", statuses: Object.values(STATUS) },
];

function StatusBadge({ status }) {
  return <span className={"lab-status-badge lab-status-" + status}>{status.replace(/_/g, " ")}</span>;
}

function LabOrders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getLabRequests();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allowedStatuses = useMemo(() => TABS.find((t) => t.id === activeTab)?.statuses || [], [activeTab]);

  const filteredOrders = useMemo(
    () => orders.filter((o) => allowedStatuses.includes(o.status)),
    [orders, allowedStatuses]
  );

  const handleAction = (order) => {
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
          <p className="section-subtitle">Real-time status management for psychiatric lab tests</p>
        </div>
        <button type="button" className="lab-btn lab-btn-secondary" onClick={fetchOrders} disabled={loading}>
          <FaSync className={loading ? "fa-spin" : ""} /> Refresh
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
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</p>
        ) : (
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
                  <td colSpan={8} style={{ textAlign: 'center', color: '#666' }}>No orders in this category.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td><strong>{order.orderId}</strong></td>
                    <td>{order.patientName}</td>
                    <td>{order.uhid}</td>
                    <td>{order.tests}</td>
                    <td>{order.source}</td>
                    <td>
                      <span style={{ color: order.priority === 'Urgent' ? 'red' : 'inherit', fontWeight: order.priority === 'Urgent' ? 'bold' : 'normal' }}>
                        {order.priority}
                      </span>
                    </td>
                    <td><StatusBadge status={order.status} /></td>
                    <td>
                      <button type="button" className="lab-btn lab-btn-primary" onClick={() => handleAction(order)}>
                        {order.status === STATUS.ORDERED ? "Collect Sample" : "Enter Results"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LabOrders;
