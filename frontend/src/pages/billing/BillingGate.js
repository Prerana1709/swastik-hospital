import React from "react";
import { Navigate } from "react-router-dom";
import { getStaffRole } from "../../utils/staffAuth";
import BillingLogin from "./BillingLogin";
import BillingDashboard from "./BillingDashboard";

/**
 * Billing route gate: billing role only.
 * Unauthorized → Billing Login (dedicated) or redirect to dashboard.
 */
function BillingGate() {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("swastik_token") : null;
  const role = getStaffRole();

  if (!token) {
    return <BillingLogin />;
  }

  if (role !== "billing") {
    return <Navigate to="/dashboard" replace />;
  }

  return <BillingDashboard />;
}

export default BillingGate;
