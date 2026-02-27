import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Doctors from "../pages/Doctors";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Placeholder components for portal and clinical - replace with actual pages when created
const PortalDashboard = () => <div>Portal Dashboard</div>;
const PortalAppointments = () => <div>Portal Appointments</div>;
const PortalBills = () => <div>Portal Bills</div>;
const PortalProfile = () => <div>Portal Profile</div>;
const ClinicalDashboard = () => <div>Clinical Dashboard</div>;
const ClinicalAppointments = () => <div>Clinical Appointments</div>;
const ClinicalPatients = () => <div>Clinical Patients</div>;
const ClinicalBilling = () => <div>Clinical Billing</div>;
const ClinicalReports = () => <div>Clinical Reports</div>;

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      {/* Patient portal - protected */}
      <Route path="/portal" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="dashboard" element={<PortalDashboard />} />
        <Route path="appointments" element={<PortalAppointments />} />
        <Route path="bills" element={<PortalBills />} />
        <Route path="profile" element={<PortalProfile />} />
      </Route>
      {/* Clinical panel - protected */}
      <Route path="/clinical" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/clinical/dashboard" replace />} />
        <Route path="dashboard" element={<ClinicalDashboard />} />
        <Route path="appointments" element={<ClinicalAppointments />} />
        <Route path="patients" element={<ClinicalPatients />} />
        <Route path="billing" element={<ClinicalBilling />} />
        <Route path="reports" element={<ClinicalReports />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
