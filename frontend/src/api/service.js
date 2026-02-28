import { API_BASE_URL, getAuthHeader } from "./config";

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Request failed");
  return data;
}

export const api = {
  async login(username, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  async getMe() {
    return request("/auth/me", { method: "GET" });
  },

  async createPatient(body) {
    return request("/api/patients", {
      method: "POST",
      body: JSON.stringify({
        name: body.patientName || body.name,
        age: body.age ? parseInt(body.age, 10) : null,
        gender: body.gender || null,
        phone: body.phone || null,
        address: [body.houseNoStreet, body.village, body.district, body.state, body.pincode].filter(Boolean).join(", ") || null,
        guardian_name: body.fatherHusbandName || null,
      }),
    });
  },

  async getPatients(skip = 0, limit = 100) {
    return request(`/api/patients?skip=${skip}&limit=${limit}`);
  },

  async getPatientByUhid(uhid) {
    return request(`/api/patients/${encodeURIComponent(uhid)}`);
  },

  async createOPD(body) {
    return request("/api/opd", { method: "POST", body: JSON.stringify(body) });
  },

  async createIPD(body) {
    return request("/api/ipd", { method: "POST", body: JSON.stringify(body) });
  },

  async getOPDList(skip = 0, limit = 100) {
    return request(`/api/opd?skip=${skip}&limit=${limit}`);
  },

  async getIPDList(skip = 0, limit = 100) {
    return request(`/api/ipd?skip=${skip}&limit=${limit}`);
  },

  async createDoctor(body) {
    return request("/api/doctors", { method: "POST", body: JSON.stringify(body) });
  },

  async getDoctors() {
    return request("/api/doctors");
  },

  async createStaff(body) {
    return request("/api/staff", { method: "POST", body: JSON.stringify(body) });
  },

  async createAppointment(body) {
    return request("/api/appointments", { method: "POST", body: JSON.stringify(body) });
  },

  async getAppointments(uhid = null, skip = 0, limit = 100) {
    const q = new URLSearchParams({ skip, limit });
    if (uhid) q.set("uhid", uhid);
    return request(`/api/appointments?${q}`);
  },

  async getDashboardCounts() {
    return request("/api/dashboard/counts");
  },

  async getReportAnalytics(filters = {}) {
    const q = new URLSearchParams(filters);
    return request(`/api/reports/analytics?${q}`);
  },

  async getPatientRecord(uhid) {
    return request(`/api/patient-records/${uhid}`);
  },

  async addPatientDocument(uhid, docData) {
    return request(`/api/patient-records/${uhid}/documents`, {
      method: "POST",
      body: JSON.stringify(docData),
    });
  },

  async deletePatientDocument(docId) {
    return request(`/api/patient-records/documents/${docId}`, {
      method: "DELETE",
    });
  },

  async getAdminLogs() {
    return request(`/api/admin/logs`);
  },

  async createAdminLog(logData) {
    return request(`/api/admin/logs`, {
      method: "POST",
      body: JSON.stringify(logData),
    });
  },

  async createLabRequest(body) {
    return request("/api/lab/requests", { method: "POST", body: JSON.stringify(body) });
  },

  async getLabRequests(status = null, skip = 0, limit = 100) {
    const q = new URLSearchParams({ skip, limit });
    if (status) q.set("status", status);
    return request(`/api/lab/requests?${q}`);
  },

  async getLabRequest(orderId) {
    return request(`/api/lab/requests/${orderId}`);
  },

  async updateLabStatus(orderId, body) {
    return request(`/api/lab/requests/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async saveLabResults(orderId, body) {
    return request(`/api/lab/requests/${orderId}/results`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getLabStats() {
    return request("/api/lab/stats");
  },

  async saveConsultation(uhid, data) {
    return request(`/api/clinical/consultation/${uhid}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async savePrescription(uhid, data) {
    return request(`/api/clinical/prescription/${uhid}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async saveIPDAdmissionDetails(uhid, data) {
    return request(`/api/clinical/ipd/admission/${uhid}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async saveIPDProgressNote(uhid, data) {
    return request(`/api/clinical/ipd/progress/${uhid}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateIPDAction(uhid, action, details) {
    return request(`/api/clinical/ipd/action/${uhid}?action=${action}`, {
      method: "PATCH",
      body: JSON.stringify(details),
    });
  },

  async saveRehabData(uhid, rehabType, data) {
    return request(`/api/clinical/rehab/${uhid}?rehab_type=${rehabType}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getClinicalHistory(uhid) {
    return request(`/api/clinical/history/${uhid}`);
  },

  async getBillingStats() {
    return request("/api/billing/stats");
  },

  // Billing – bills and payments
  async createBill(body) {
    return request("/api/bills", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getBills(skip = 0, limit = 100) {
    return request(`/api/bills?skip=${skip}&limit=${limit}`);
  },

  async getBill(billId) {
    return request(`/api/bills/${encodeURIComponent(billId)}`);
  },

  async getBillsByPatient(patientId) {
    return request(`/api/bills/patient/${encodeURIComponent(patientId)}`);
  },

  async addBillPayment(billId, data) {
    return request(`/api/bills/${encodeURIComponent(billId)}/payment`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
