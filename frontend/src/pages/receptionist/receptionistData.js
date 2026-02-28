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
};

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
