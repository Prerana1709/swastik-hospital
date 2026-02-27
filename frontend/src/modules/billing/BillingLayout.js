// Billing / Payment: header with logo + "Payment & Billing", then Crater embedded in iframe (same tab).
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import swastikLogo from "../../assets/swastiklogo.png";
import "./BillingLayout.css";

function BillingLayout() {
  const location = useLocation();
  const isBilling = location.pathname.startsWith("/billing");

  return (
    <div className="billing-dashboard">
      <header className="billing-header">
        <div className="billing-header-left">
          {isBilling && (
            <Link to="/" className="billing-back-btn" aria-label="Back to home">
              <FaArrowLeft /> Back
            </Link>
          )}
        </div>
        <div className="billing-logo-title">
          <img src={swastikLogo} alt="Swastik Hospital" className="billing-header-logo" />
          <div className="billing-header-text">
            <h1>Swastik Hospital</h1>
            <p className="billing-page-title">Payment & Billing</p>
          </div>
        </div>
        <div className="billing-header-right" />
      </header>
      <main className="billing-main">
        <Outlet />
      </main>
    </div>
  );
}

export default BillingLayout;
