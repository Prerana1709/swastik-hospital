/**
 * Receptionist module – shared data keys and helpers.
 * Persist in localStorage; replace with API in production.
 */

export const STORAGE_KEYS = {
  APPOINTMENTS: "swastik_recep_appointments",
  PENDING_REQUESTS: "swastik_recep_pending_requests",
  PATIENTS_TODAY: "swastik_recep_patients_today",
  EMERGENCY_QUEUE: "swastik_recep_emergency_queue",
  ADMISSION_REQUESTS: "swastik_recep_admission_requests",
  REGISTERED_PATIENTS: "swastik_recep_registered_patients",
  BEDS: "swastik_recep_beds",
  DOCTORS: "swastik_recep_doctors",
  INVOICES: "swastik_recep_invoices",
};

export const HOSPITAL_PRICING = {
  // Consultation & Registration
  REGISTRATION: 500,
  CASE_PAPER: 200,
  OPD_CONSULTATION: 800,
  SPECIALIST_CONSULTATION: 1500,
  EMERGENCY_VISIT: 2500,

  // IPD / Ward Charges (Per Day)
  IPD_GENERAL_BED: 2000,
  IPD_PRIVATE_ROOM: 5000,
  IPD_OBSERVATION: 3000,
  ICU_CHARGES: 12000,

  // Laboratory Services
  BLOOD_TEST_CBC: 450,
  KIDNEY_PROFILE: 1200,
  LIVER_FUNCTION_TEST: 1500,
  URINE_ANALYSIS: 300,
  COVID_RT_PCR: 800,

  // Radiology & Imaging
  X_RAY_CHEST: 600,
  ULTRASOUND_ABDOMEN: 1800,
  MRI_BRAIN: 8500,
  CT_SCAN_WHOLE_BODY: 15000,

  // Pharmacy & Consumables
  MEDICATION_PACKAGE_BASIC: 2500,
  SURGICAL_CONSUMABLES: 3500,
  IV_FLUIDS_SET: 1200,

  // Procedures
  MINOR_STITCHING: 2000,
  DRESSING_CHARGES: 500,
  PHYSIOTHERAPY_SESSION: 1200,
};

export function getInvoices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveInvoice(invoice) {
  const existing = getInvoices();
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([...existing, invoice]));
}

export function generateInvoiceID() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${random}`;
}

const defaultAppointments = [
  { id: "apt1", patientName: "Patient A", doctor: "Dr. Sharma", date: new Date().toISOString().slice(0, 10), time: "09:00", status: "confirmed", type: "OPD" },
  { id: "apt2", patientName: "Patient B", doctor: "Dr. Patel", date: new Date().toISOString().slice(0, 10), time: "10:30", status: "pending", type: "Therapy" },
  { id: "apt3", patientName: "Patient C", doctor: "Dr. Sharma", date: new Date().toISOString().slice(0, 10), time: "11:00", status: "completed", type: "OPD" },
];

const defaultPending = [
  { id: "req1", patientName: "Online User 1", doctor: "Dr. Sharma", date: new Date().toISOString().slice(0, 10), time: "14:00", type: "OPD" },
  { id: "req2", patientName: "Online User 2", doctor: "Dr. Patel", date: new Date().toISOString().slice(0, 10), time: "15:30", type: "Therapy" },
];

const defaultDoctors = [
  { id: "d1", name: "Dr. Sharma", available: true },
  { id: "d2", name: "Dr. Patel", available: false },
];

export function getTodayAppointments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    const list = raw ? JSON.parse(raw) : defaultAppointments;
    const today = new Date().toISOString().slice(0, 10);
    return list.filter((a) => a.date === today);
  } catch {
    return defaultAppointments.filter((a) => a.date === new Date().toISOString().slice(0, 10));
  }
}

export function getPendingRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_REQUESTS);
    return raw ? JSON.parse(raw) : defaultPending;
  } catch {
    return defaultPending;
  }
}

export function setPendingRequests(list) {
  localStorage.setItem(STORAGE_KEYS.PENDING_REQUESTS, JSON.stringify(list));
}

export function getDoctors() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return raw ? JSON.parse(raw) : defaultDoctors;
  } catch {
    return defaultDoctors;
  }
}

export function getEmergencyQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setEmergencyQueue(list) {
  localStorage.setItem(STORAGE_KEYS.EMERGENCY_QUEUE, JSON.stringify(list));
}

export function getAdmissionRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMISSION_REQUESTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getPatientsTodayCounts() {
  const today = new Date().toISOString().slice(0, 10);
  const appointments = getTodayAppointments();
  return {
    opd: appointments.filter((a) => a.type === "OPD").length,
    followUp: 0,
    therapy: appointments.filter((a) => a.type === "Therapy").length,
    emergency: getEmergencyQueue().length,
    total:
      appointments.length +
      getEmergencyQueue().length,
  };
}

export function generateUHID() {
  const y = new Date().getFullYear();
  const r = Math.floor(100000 + Math.random() * 900000);
  return `UHID-${y}-${r}`;
}

export function generateCaseNumber() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `CASE-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function generateVisitId() {
  return `VIS-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
}

export function generateQueueToken() {
  return `Q-${Math.floor(1 + Math.random() * 99)}`;
}
