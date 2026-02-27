// Sample collection: Live data integration, status update to SAMPLE_COLLECTED.
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./lab.css";
import { api } from "../../api/service";

function SampleCollection() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sampleId, setSampleId] = useState("");
  const [collectionTime, setCollectionTime] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getLabRequest(orderId);
        setOrder(data);
        // Generate a sample ID based on order ID if not already set
        setSampleId(`SAM-${orderId.split('-')[1]}`);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleMarkCollected = async () => {
    try {
      await api.updateLabStatus(orderId, {
        status: "SAMPLE_COLLECTED",
        sampleId,
        collectionTime
      });
      alert("Sample marked as collected successfully");
      navigate("/lab/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to update status: " + err.message);
    }
  };

  const handlePrintLabel = () => {
    window.print();
  };

  if (loading) return <div className="content-area lab-page"><p>Loading order details...</p></div>;
  if (!order) return <div className="content-area lab-page"><p>Order not found.</p></div>;

  return (
    <div className="content-area lab-page">
      <div className="no-print">
        <Link to="/lab/orders" className="lab-back-link">
          <FaArrowLeft /> Back to Lab Orders
        </Link>
        <h2>Sample Collection</h2>
        <p className="section-subtitle">Order: {orderId}</p>

        <div className="lab-section">
          <h3>Order Summary</h3>
          <div className="lab-patient-summary">
            <div className="item"><strong>Patient</strong>{order.patientName}</div>
            <div className="item"><strong>UHID</strong>{order.uhid}</div>
            <div className="item"><strong>Tests</strong>{order.tests}</div>
            <div className="item"><strong>Source</strong>{order.source}</div>
          </div>
        </div>

        <div className="lab-section">
          <h3>Sample Details</h3>
          <div className="lab-form-row">
            <label>Sample ID</label>
            <input type="text" value={sampleId} onChange={(e) => setSampleId(e.target.value)} style={{ maxWidth: 200 }} />
          </div>
          <div className="lab-form-row">
            <label>Collection Date & Time</label>
            <input
              type="datetime-local"
              value={collectionTime}
              onChange={(e) => setCollectionTime(e.target.value)}
            />
          </div>
        </div>

        <div className="lab-section">
          <div className="no-print">
            <button type="button" className="lab-btn lab-btn-secondary" onClick={handlePrintLabel}>
              Print Sample Label
            </button>
            <button type="button" className="lab-btn lab-btn-primary" onClick={handleMarkCollected} style={{ marginLeft: 12 }}>
              Mark Sample Collected
            </button>
          </div>
        </div>
      </div>

      <div className="sample-label-print">
        <div className="label-title">Swastik Hospital Lab Label</div>
        <p><strong>Patient:</strong> {order.patientName}</p>
        <p><strong>UHID:</strong> {order.uhid}</p>
        <p><strong>Tests:</strong> {order.tests}</p>
        <p><strong>Sample ID:</strong> {sampleId}</p>
        <p><strong>Time:</strong> {collectionTime.replace('T', ' ')}</p>
      </div>
    </div>
  );
}

export default SampleCollection;
