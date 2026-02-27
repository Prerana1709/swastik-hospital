// Bahmni-style module-based routing. Registration has its own layout (header/footer only there).
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PatientHome from "./pages/PatientHome";
import PatientPortal from "./pages/PatientPortal";
import PortalLogin from "./pages/PortalLogin";
import PortalRegistration from "./pages/PortalRegistration";
import PortalDashboard from "./pages/PortalDashboard";
import PortalAppointmentBook from "./pages/PortalAppointmentBook";
import PortalMedicalRecords from "./pages/PortalMedicalRecords";

import Login from "./modules/auth/Login";
import Registration from "./modules/auth/Registration";
import Dashboard from "./modules/dashboard/Dashboard";
import Clinical from "./modules/emr/Clinical";
import ReportsLayout from "./modules/reports/ReportsLayout";
import ReportsDashboard from "./modules/reports/ReportsDashboard";
import MentalHealthOverviewReport from "./modules/reports/MentalHealthOverviewReport";
import PsychologicalScaleAnalyticsReport from "./modules/reports/PsychologicalScaleAnalyticsReport";
import TherapyRehabAnalyticsReport from "./modules/reports/TherapyRehabAnalyticsReport";
import PsychiatricIPDAnalyticsReport from "./modules/reports/PsychiatricIPDAnalyticsReport";
import MedicationComplianceReport from "./modules/reports/MedicationComplianceReport";
import RiskSafetyMonitoringReport from "./modules/reports/RiskSafetyMonitoringReport";
import LabLayout from "./modules/lab/LabLayout";
import LabDashboard from "./modules/lab/LabDashboard";
import LabOrders from "./modules/lab/LabOrders";
import SampleCollection from "./modules/lab/SampleCollection";
import LabResultEntry from "./modules/lab/LabResultEntry";
import LabReports from "./modules/lab/LabReports";
import AddNewSample from "./modules/lab/AddNewSample";
import ImplementerLayout from "./modules/implementer/ImplementerLayout";
import ImplementerDashboard from "./modules/implementer/ImplementerDashboard";
import PsychiatricDepartmentConfig from "./modules/implementer/PsychiatricDepartmentConfig";
import PsychiatricClinicalFormBuilder from "./modules/implementer/PsychiatricClinicalFormBuilder";
import PsychiatricScalesAssessment from "./modules/implementer/PsychiatricScalesAssessment";
import RiskSafetyConfig from "./modules/implementer/RiskSafetyConfig";
import TherapyRehabSettings from "./modules/implementer/TherapyRehabSettings";
import PsychiatricIPDWardConfig from "./modules/implementer/PsychiatricIPDWardConfig";
import PsychiatricMedicationMonitoring from "./modules/implementer/PsychiatricMedicationMonitoring";
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
import Billing from "./modules/billing/Billing";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import RegistrationLayout from "./layouts/RegistrationLayout";

import PatientRegistration from "./modules/registration/PatientRegistration";
import DoctorRegistration from "./modules/registration/DoctorRegistration";
import StaffRegistration from "./modules/registration/StaffRegistration";
import OPDRegistration from "./modules/registration/OPDRegistration";
import clinical from "./assets/clinical.png";
import billing from "./assets/bills.png";
import analytics from "./assets/analytics.png";
import IPDAdmission from "./modules/registration/IPDAdmission";

import AnalyticsPage from "./modules/analytics/AnalyticsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Patient Home – public landing; redirects to /dashboard via CTA / Patient Login */}
        <Route path="/" element={<PatientHome />} />
        <Route path="/patient-portal" element={<PatientPortal />}>
          <Route path="login" element={<PortalLogin />} />
          <Route path="register" element={<PortalRegistration />} />
          <Route path="dashboard" element={<PortalDashboard />} />
          <Route path="appointments" element={<PortalAppointmentBook />} />
          <Route path="records" element={<PortalMedicalRecords />} />
        </Route>


        {/* Standalone Analytics: dedicated layout, not inside dashboard */}
        <Route path="/analytics" element={<AnalyticsPage />} />

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
            <Route path="mental-health" element={<MentalHealthOverviewReport />} />
            <Route path="psychological-scales" element={<PsychologicalScaleAnalyticsReport />} />
            <Route path="therapy-rehab" element={<TherapyRehabAnalyticsReport />} />
            <Route path="psychiatric-ipd" element={<PsychiatricIPDAnalyticsReport />} />
            <Route path="medication-compliance" element={<MedicationComplianceReport />} />
            <Route path="risk-safety" element={<RiskSafetyMonitoringReport />} />
            <Route path="patient-records" element={<PatientDocuments />} />
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
            <Route path="psych-departments" element={<PsychiatricDepartmentConfig />} />
            <Route path="clinical-forms" element={<PsychiatricClinicalFormBuilder />} />
            <Route path="scales-assessment" element={<PsychiatricScalesAssessment />} />
            <Route path="risk-safety" element={<RiskSafetyConfig />} />
            <Route path="therapy-rehab" element={<TherapyRehabSettings />} />
            <Route path="ipd-ward" element={<PsychiatricIPDWardConfig />} />
            <Route path="medication-monitoring" element={<PsychiatricMedicationMonitoring />} />
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
            <Route index element={<Billing />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
