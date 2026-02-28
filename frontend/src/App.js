// App routes – uses pages and layouts only (no modules folder).
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PatientHome from "./pages/PatientHome";
import PatientPortal from "./pages/PatientPortal";
import PortalLogin from "./pages/PortalLogin";
import PortalRegistration from "./pages/PortalRegistration";
import PortalDashboard from "./pages/PortalDashboard";
import PortalAppointmentBook from "./pages/PortalAppointmentBook";
import PortalMedicalRecords from "./pages/PortalMedicalRecords";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StaffSection from "./pages/StaffSection";
import DoctorLayout from "./modules/doctor/DoctorLayout";
import DoctorDashboard from "./modules/doctor/DoctorDashboard";
import DoctorAppointments from "./modules/doctor/DoctorAppointments";
import DoctorPatients from "./modules/doctor/DoctorPatients";
import DoctorConsultation from "./modules/doctor/DoctorConsultation";
import DoctorPlaceholder from "./modules/doctor/DoctorPlaceholder";
import Billing from "./pages/Billing";
import BillingGate from "./pages/billing/BillingGate";
import PlaceholderPage from "./pages/PlaceholderPage";

import ReceptionistLayout from "./pages/receptionist/ReceptionistLayout";
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import ReceptionistAppointments from "./pages/receptionist/ReceptionistAppointments";
import PatientRegistration from "./pages/receptionist/PatientRegistration";
import PatientList from "./pages/receptionist/PatientList";
import SearchUHID from "./pages/receptionist/SearchUHID";
import Admissions from "./pages/receptionist/Admissions";
import ReceptionistBilling from "./pages/receptionist/ReceptionistBilling";
import Notifications from "./pages/receptionist/Notifications";

import AuthLayout from "./layouts/AuthLayout";
import RegistrationLayout from "./layouts/RegistrationLayout";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientHome />} />
        <Route path="/patient-portal" element={<PatientPortal />}>
          <Route path="login" element={<PortalLogin />} />
          <Route path="register" element={<PortalRegistration />} />
          <Route path="dashboard" element={<PortalDashboard />} />
          <Route path="appointments" element={<PortalAppointmentBook />} />
          <Route path="records" element={<PortalMedicalRecords />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/billing" element={<BillingGate />} />

        <Route path="/registration" element={<RegistrationLayout />}>
          <Route index element={<Register />} />
          <Route path="patient" element={<PlaceholderPage />} />
          <Route path="doctor" element={<PlaceholderPage />} />
          <Route path="staff" element={<PlaceholderPage />} />
          <Route path="opd" element={<PlaceholderPage />} />
          <Route path="ipd" element={<PlaceholderPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/receptionist" element={<ReceptionistLayout />}>
            <Route index element={<ReceptionistDashboard />} />
            <Route path="appointments" element={<ReceptionistAppointments />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patients/register" element={<PatientRegistration />} />
            <Route path="patients/search" element={<SearchUHID />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="billing" element={<ReceptionistBilling />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="consultation" element={<DoctorConsultation />} />
            <Route path="consultation/:uhid" element={<DoctorConsultation />} />
            <Route path="assessments" element={<DoctorPlaceholder title="Assessments" />} />
            <Route path="prescriptions" element={<DoctorPlaceholder title="Prescriptions" />} />
            <Route path="reports" element={<DoctorPlaceholder title="Reports" />} />
            <Route path="settings" element={<DoctorPlaceholder title="Settings" />} />
          </Route>
          <Route path="/lab" element={<StaffSection />} />
          <Route path="/admin" element={<StaffSection />} />
          <Route path="/clinical/*" element={<PlaceholderPage />} />
          <Route path="/reports/*" element={<PlaceholderPage />} />
          <Route path="/lab/*" element={<PlaceholderPage />} />
          <Route path="/implementer/*" element={<PlaceholderPage />} />
          <Route path="/admin/*" element={<PlaceholderPage />} />
          <Route path="/patient-documents/*" element={<PlaceholderPage />} />
          <Route path="/appointments/*" element={<PlaceholderPage />} />
          <Route path="/analytics" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
