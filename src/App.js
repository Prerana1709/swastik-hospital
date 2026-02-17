// Bahmni-style module-based routing. Registration has its own layout (header/footer only there).
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Header from "./components/navbar/Header";
import FeatureCard from "./components/cards/FeatureCard";
import Footer from "./components/Footer/Footer";

import Login from "./modules/auth/Login";
import Registration from "./modules/auth/Registration";
import Dashboard from "./modules/dashboard/Dashboard";
import Clinical from "./modules/emr/Clinical";
import ReportsLayout from "./modules/reports/ReportsLayout";
import ReportsDashboard from "./modules/reports/ReportsDashboard";
import DailySummaryReport from "./modules/reports/DailySummaryReport";
import MonthlyAnalyticsReport from "./modules/reports/MonthlyAnalyticsReport";
import PatientStatisticsReport from "./modules/reports/PatientStatisticsReport";
import FinancialReports from "./modules/reports/FinancialReports";
import OPDOperationalReport from "./modules/reports/OPDOperationalReport";
import IPDOccupancyReport from "./modules/reports/IPDOccupancyReport";
import StaffPerformanceReport from "./modules/reports/StaffPerformanceReport";
import LabLayout from "./modules/lab/LabLayout";
import LabDashboard from "./modules/lab/LabDashboard";
import LabOrders from "./modules/lab/LabOrders";
import SampleCollection from "./modules/lab/SampleCollection";
import LabResultEntry from "./modules/lab/LabResultEntry";
import LabReports from "./modules/lab/LabReports";
import AddNewSample from "./modules/lab/AddNewSample";
import ImplementerLayout from "./modules/implementer/ImplementerLayout";
import ImplementerDashboard from "./modules/implementer/ImplementerDashboard";
import Departments from "./modules/implementer/Departments";
import Users from "./modules/implementer/Users";
import LabConfig from "./modules/implementer/LabConfig";
import BillingConfig from "./modules/implementer/BillingConfig";
import Forms from "./modules/implementer/Forms";
import Workflow from "./modules/implementer/Workflow";
import Settings from "./modules/implementer/Settings";
import AdminLayout from "./modules/admin/AdminLayout";
import AdminDashboard from "./modules/admin/AdminDashboard";
import AdminUsers from "./modules/admin/AdminUsers";
import AdminRoles from "./modules/admin/AdminRoles";
import AdminStaff from "./modules/admin/AdminStaff";
import AdminLogs from "./modules/admin/AdminLogs";
import AdminAccess from "./modules/admin/AdminAccess";
import PatientDocumentsLayout from "./modules/patient-documents/PatientDocumentsLayout";
import PatientDocuments from "./modules/patient-documents/PatientDocuments";
import AppointmentsLayout from "./modules/appointments/AppointmentsLayout";
import Appointments from "./modules/appointments/Appointments";
import BillingLayout from "./modules/billing/BillingLayout";
import CraterBilling from "./modules/billing/CraterBilling";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import RegistrationLayout from "./layouts/RegistrationLayout";

import PatientRegistration from "./modules/registration/PatientRegistration";
import DoctorRegistration from "./modules/registration/DoctorRegistration";
import StaffRegistration from "./modules/registration/StaffRegistration";
import OPDRegistration from "./modules/registration/OPDRegistration";
import IPDAdmission from "./modules/registration/IPDAdmission";

import clinical from "./assets/clinical.png";
import billing from "./assets/bills.png";
import analytics from "./assets/analytics.png";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LANDING PAGE - no RegistrationLayout */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <main className="main">
                <h1>
                  WELCOME TO <br /> SWASTIK EMR FOR CLINICS
                </h1>
                <p className="subtitle">GET STARTED</p>
                <div className="card-container">
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "inherit" }}
                    aria-label="Open login"
                  >
                    <FeatureCard icon={clinical} title="CLINICAL SERVICE" />
                  </Link>
                  <Link
                    to="/billing"
                    style={{ textDecoration: "none", color: "inherit" }}
                    aria-label="Open payment and billing"
                  >
                    <FeatureCard icon={billing} title="PAYMENT & BILLING" />
                  </Link>
                  <FeatureCard icon={analytics} title="ANALYTICS" />
                </div>
              </main>
              <Footer />
            </>
          }
        />

        {/* AUTH: Login only; no registration header/footer */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* REGISTRATION: all /registration/* use RegistrationLayout (header + footer) */}
        <Route path="/registration" element={<RegistrationLayout />}>
          <Route index element={<Registration />} />
          <Route path="patient" element={<PatientRegistration />} />
          <Route path="doctor" element={<DoctorRegistration />} />
          <Route path="staff" element={<StaffRegistration />} />
          <Route path="opd" element={<OPDRegistration />} />
          <Route path="ipd" element={<IPDAdmission />} />
        </Route>

        {/* AUTHENTICATED ROUTES - no RegistrationLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clinical" element={<Clinical />} />
          <Route path="/reports" element={<ReportsLayout />}>
            <Route index element={<ReportsDashboard />} />
            <Route path="daily" element={<DailySummaryReport />} />
            <Route path="monthly" element={<MonthlyAnalyticsReport />} />
            <Route path="patients" element={<PatientStatisticsReport />} />
            <Route path="finance" element={<FinancialReports />} />
            <Route path="opd-operational" element={<OPDOperationalReport />} />
            <Route path="ipd-occupancy" element={<IPDOccupancyReport />} />
            <Route path="staff-performance" element={<StaffPerformanceReport />} />
          </Route>
          <Route path="/lab" element={<LabLayout />}>
            <Route index element={<LabDashboard />} />
            <Route path="orders" element={<LabOrders />} />
            <Route path="collect/:orderId" element={<SampleCollection />} />
            <Route path="result/:orderId" element={<LabResultEntry />} />
            <Route path="reports" element={<LabReports />} />
            <Route path="new-sample" element={<AddNewSample />} />
          </Route>
          <Route path="/implementer" element={<ImplementerLayout />}>
            <Route index element={<ImplementerDashboard />} />
            <Route path="departments" element={<Departments />} />
            <Route path="users" element={<Users />} />
            <Route path="lab-config" element={<LabConfig />} />
            <Route path="billing-config" element={<BillingConfig />} />
            <Route path="forms" element={<Forms />} />
            <Route path="workflow" element={<Workflow />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="access" element={<AdminAccess />} />
          </Route>
          <Route path="/patient-documents" element={<PatientDocumentsLayout />}>
            <Route index element={<PatientDocuments />} />
          </Route>
          <Route path="/appointments" element={<AppointmentsLayout />}>
            <Route index element={<Appointments />} />
          </Route>
          <Route path="/billing" element={<BillingLayout />}>
            <Route index element={<CraterBilling />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
