// Advanced Appointment Management: New Appointment (UHID + API), List and Calendar from backend.
import React, { useState, useMemo, useEffect } from "react";
import { api } from "../../api/service";
import "../implementer/implementer.css";
import "./Appointments.css";

const DEPARTMENTS = [
  { id: "psychiatry", name: "Psychiatry" },
  { id: "clinical_psychology", name: "Clinical Psychology" },
  { id: "rehab", name: "Rehabilitation" },
  { id: "therapy", name: "Therapy / Counseling" },
  { id: "child_psychiatry", name: "Child & Adolescent Psychiatry" },
];

function generateTimeSlots() {
  const slots = [];
  for (let h = 9; h <= 16; h++) {
    for (let m = 0; m < 60; m += 15) {
      const HH = String(h).padStart(2, "0");
      const MM = String(m).padStart(2, "0");
      slots.push(`${HH}:${MM}`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

const STATUS_CONFIG = {
  Scheduled: { label: "Scheduled", className: "apt-badge-scheduled" },
  scheduled: { label: "Scheduled", className: "apt-badge-scheduled" },
  Completed: { label: "Completed", className: "apt-badge-completed" },
  completed: { label: "Completed", className: "apt-badge-completed" },
  Cancelled: { label: "Cancelled", className: "apt-badge-cancelled" },
  cancelled: { label: "Cancelled", className: "apt-badge-cancelled" },
  "No Show": { label: "No Show", className: "apt-badge-noshow" },
};

function mapApiAppointment(a) {
  return {
    id: a._id,
    uhid: a.uhid,
    patientName: a.patient_name || "—",
    date: a.appointment_date || "",
    timeSlot: a.appointment_time || "",
    doctorId: a.doctor_id || "",
    status: a.status === "scheduled" ? "Scheduled" : a.status === "cancelled" ? "Cancelled" : a.status === "completed" ? "Completed" : a.status || "Scheduled",
  };
}

const LIST_FILTERS = ["Today", "Upcoming", "Completed", "Cancelled"];

function Appointments() {
  const [activeTab, setActiveTab] = useState("new");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [listFilter, setListFilter] = useState("Today");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [cancelAppointment, setCancelAppointment] = useState(null);
  const [printAppointment, setPrintAppointment] = useState(null);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    uhid: "",
    patientName: "",
    phone: "",
    date: "",
    doctorId: "",
    departmentId: "",
    timeSlot: "",
    type: "general",
    notes: "",
  });

  useEffect(() => {
    api.getAppointments().then((list) => setAppointments(Array.isArray(list) ? list.map(mapApiAppointment) : [])).catch(() => { });
    api.getDoctors().then((list) => setDoctors(Array.isArray(list) ? list : [])).catch(() => { });
  }, []);

  const doctorsByDept = useMemo(() => {
    if (!form.departmentId) return doctors;
    return doctors.filter((d) => String(d.department || "").toLowerCase() === String(form.departmentId).toLowerCase());
  }, [doctors, form.departmentId]);

  const bookedSlotsForDoctorDate = useMemo(() => {
    if (!form.date || !form.doctorId) return new Set();
    const set = new Set();
    appointments.forEach((a) => {
      if (
        a.date === form.date &&
        String(a.doctorId) === String(form.doctorId) &&
        a.status !== "Cancelled"
      ) {
        set.add(a.timeSlot);
      }
    });
    return set;
  }, [appointments, form.date, form.doctorId]);

  const fetchPatientByUhid = () => {
    const u = (form.uhid || "").trim();
    if (!u) return;
    api.getPatientByUhid(u).then((p) => setForm((f) => ({ ...f, patientName: p.name || f.patientName }))).catch(() => setForm((f) => ({ ...f, patientName: "" })));
  };

  const handleSubmitNew = async (e) => {
    e.preventDefault();
    setFormError("");
    const uhid = (form.uhid || "").trim();
    if (!uhid) {
      setFormError("UHID is required. Enter the patient's UHID from registration.");
      return;
    }
    if (!form.patientName.trim() || !form.date || !form.doctorId || !form.timeSlot) {
      setFormError("Please fill Patient Name, Date, Doctor, and Time Slot.");
      return;
    }
    if (bookedSlotsForDoctorDate.has(form.timeSlot)) {
      setFormError("This time slot is already booked for the selected doctor.");
      return;
    }
    try {
      await api.createAppointment({
        uhid,
        patient_name: form.patientName.trim(),
        doctor_id: form.doctorId || undefined,
        appointment_date: form.date,
        appointment_time: form.timeSlot,
        type: form.type || "general",
        notes: form.notes || undefined,
      });
      const list = await api.getAppointments();
      setAppointments(Array.isArray(list) ? list.map(mapApiAppointment) : []);
      setForm({ uhid: "", patientName: "", phone: "", date: "", doctorId: "", departmentId: "", timeSlot: "", type: "general", notes: "" });
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 4000);
    } catch (err) {
      setFormError(err.message || "Failed to book appointment.");
    }
  };

  const filteredList = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    switch (listFilter) {
      case "Today":
        return appointments.filter((a) => a.date === today && a.status !== "Cancelled");
      case "Upcoming":
        return appointments.filter((a) => a.date >= today && (a.status === "Scheduled" || a.status === "scheduled"));
      case "Completed":
        return appointments.filter((a) => a.status === "Completed" || a.status === "completed");
      case "Cancelled":
        return appointments.filter((a) => a.status === "Cancelled" || a.status === "cancelled");
      default:
        return appointments;
    }
  }, [appointments, listFilter]);

  const handleReschedule = (apt, newDate, newTimeSlot) => {
    const conflict = appointments.some(
      (a) =>
        a.id !== apt.id &&
        a.date === newDate &&
        String(a.doctorId) === String(apt.doctorId) &&
        a.timeSlot === newTimeSlot &&
        a.status !== "Cancelled"
    );
    if (conflict) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === apt.id ? { ...a, date: newDate, timeSlot: newTimeSlot } : a
      )
    );
    setRescheduleAppointment(null);
  };

  const handleCancel = (apt) => {
    setAppointments((prev) => prev.map((a) => (a.id === apt.id ? { ...a, status: "Cancelled" } : a)));
    setCancelAppointment(null);
  };

  const handlePrintSlip = (apt) => {
    setPrintAppointment(apt);
    setTimeout(() => {
      window.print();
      setPrintAppointment(null);
    }, 300);
  };

  const getDoctorName = (id) => {
    if (id === "dr_pm_chougule") return "Dr. P. M. Chougule";
    if (id === "dr_nikhil_chougule") return "Dr. Nikhil Chougule";
    return doctors.find((d) => String(d._id) === String(id))?.name || id || "—";
  };
  const getDepartmentName = (id) => DEPARTMENTS.find((d) => d.id === id)?.name || id || "—";

  const calendarMonth = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const startPad = first.getDay();
    const counts = {};
    appointments.forEach((a) => {
      if (a.status === "Cancelled") return;
      const key = a.date;
      if (key && key.slice(0, 7) === `${year}-${String(month + 1).padStart(2, "0")}`) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return { year, month: month + 1, daysInMonth, startPad, counts };
  }, [appointments]);

  const tabs = [
    { id: "new", label: "New Appointment" },
    { id: "list", label: "Appointment List" },
    { id: "calendar", label: "Calendar View" },
  ];

  return (
    <div className="content-area apt-page">
      <div className="apt-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={"apt-tab " + (activeTab === t.id ? "active" : "")}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "new" && (
        <div className="apt-card apt-form-card">
          <h3>New Appointment</h3>
          {bookingSuccess && (
            <div className="apt-success-msg">Appointment booked successfully. You can view it in the Appointment List.</div>
          )}
          {formError && <div className="apt-error-msg">{formError}</div>}
          <form onSubmit={handleSubmitNew}>
            <div className="apt-form-row">
              <label>UHID <span className="required">*</span></label>
              <input
                type="text"
                value={form.uhid}
                onChange={(e) => setForm((f) => ({ ...f, uhid: e.target.value }))}
                onBlur={fetchPatientByUhid}
                placeholder="Enter patient UHID (from registration)"
                required
              />
            </div>
            <div className="apt-form-row">
              <label>Patient Name</label>
              <input
                type="text"
                value={form.patientName}
                onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
                placeholder="Fetched from UHID or enter manually"
                required
              />
            </div>
            <div className="apt-form-row">
              <label>Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="Phone number"
              />
            </div>
            <div className="apt-form-row">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, timeSlot: "" }))}
                required
              />
            </div>
            <div className="apt-form-row">
              <label>Department</label>
              <select
                value={form.departmentId}
                onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value, doctorId: "" }))}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="apt-form-row">
              <label>Doctor</label>
              <select
                value={form.doctorId}
                onChange={(e) => setForm((f) => ({ ...f, doctorId: e.target.value, timeSlot: form.timeSlot && bookedSlotsForDoctorDate.has(form.timeSlot) ? "" : f.timeSlot }))}
                required
              >
                <option value="">Select doctor</option>
                <option value="dr_pm_chougule">Dr. P. M. Chougule (M.D. Psychological Med., D.P.M. (Mumbai), M.B.F.L.P.S, M.A.P.A. (USA))</option>
                <option value="dr_nikhil_chougule">Dr. Nikhil Chougule (M.D. Psychiatry (Mumbai), M.D. Medicine (Russia))</option>
              </select>
            </div>
            <div className="apt-form-row">
              <label>Time Slot</label>
              <select
                value={form.timeSlot}
                onChange={(e) => setForm((f) => ({ ...f, timeSlot: e.target.value }))}
                required
              >
                <option value="">Select time</option>
                {TIME_SLOTS.map((slot) => {
                  const disabled = bookedSlotsForDoctorDate.has(slot);
                  return (
                    <option key={slot} value={slot} disabled={disabled}>
                      {slot}{disabled ? " (Booked)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="apt-form-row">
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="general">General</option>
                <option value="therapy">Therapy / Rehab</option>
                <option value="opd">OPD</option>
              </select>
            </div>
            <div className="apt-form-row">
              <label>Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Optional notes"
              />
            </div>
            <button type="submit" className="impl-btn impl-btn-primary">Book Appointment</button>
          </form>
        </div>
      )}

      {activeTab === "list" && (
        <div className="apt-card">
          <h3>Appointment List</h3>
          <div className="apt-list-filters">
            {LIST_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={"impl-btn " + (listFilter === f ? "impl-btn-primary" : "impl-btn-secondary")}
                onClick={() => setListFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="apt-table-wrap">
            <table className="impl-table apt-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>UHID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="apt-empty">No appointments found</td>
                  </tr>
                ) : (
                  filteredList.map((apt) => (
                    <tr key={apt.id}>
                      <td>{apt.id}</td>
                      <td>{apt.uhid || "—"}</td>
                      <td>{apt.patientName}</td>
                      <td>{getDoctorName(apt.doctorId)}</td>
                      <td>{apt.date}</td>
                      <td>{apt.timeSlot}</td>
                      <td>
                        <span className={"apt-badge " + (STATUS_CONFIG[apt.status]?.className || "")}>
                          {STATUS_CONFIG[apt.status]?.label || apt.status}
                        </span>
                      </td>
                      <td className="apt-actions">
                        {apt.status === "Scheduled" && (
                          <>
                            <button type="button" className="apt-action-btn" onClick={() => setRescheduleAppointment(apt)}>Reschedule</button>
                            <button type="button" className="apt-action-btn apt-action-cancel" onClick={() => setCancelAppointment(apt)}>Cancel</button>
                          </>
                        )}
                        <button type="button" className="apt-action-btn" onClick={() => handlePrintSlip(apt)}>Print</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="apt-card apt-calendar-card">
          <h3>Calendar View</h3>
          <p className="apt-calendar-month">
            {new Date(calendarMonth.year, calendarMonth.month - 1, 1).toLocaleString("default", { month: "long", year: "numeric" })}
          </p>
          <div className="apt-calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="apt-calendar-day-head">{day}</div>
            ))}
            {Array.from({ length: calendarMonth.startPad }, (_, i) => (
              <div key={`pad-${i}`} className="apt-calendar-cell apt-calendar-pad" />
            ))}
            {Array.from({ length: calendarMonth.daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${calendarMonth.year}-${String(calendarMonth.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const count = calendarMonth.counts[dateStr] || 0;
              return (
                <div key={day} className="apt-calendar-cell">
                  <span className="apt-calendar-num">{day}</span>
                  {count > 0 && <span className="apt-calendar-count">{count} appointment{count !== 1 ? "s" : ""}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reschedule modal */}
      {rescheduleAppointment && (
        <RescheduleModal
          appointment={rescheduleAppointment}
          appointments={appointments}
          doctors={doctors}
          onSave={handleReschedule}
          onClose={() => setRescheduleAppointment(null)}
        />
      )}

      {/* Cancel confirmation */}
      {cancelAppointment && (
        <div className="apt-modal-overlay" onClick={() => setCancelAppointment(null)}>
          <div className="apt-modal apt-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Appointment</h3>
            <p>Are you sure you want to cancel appointment <strong>{cancelAppointment.id}</strong> for {cancelAppointment.patientName}?</p>
            <div className="apt-modal-footer">
              <button type="button" className="impl-btn impl-btn-secondary" onClick={() => setCancelAppointment(null)}>No</button>
              <button type="button" className="impl-btn impl-btn-primary apt-cancel-btn" onClick={() => handleCancel(cancelAppointment)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Print slip - visible only when printing */}
      {printAppointment && (
        <div className="apt-print-slip">
          <div className="apt-slip-content">
            <h2>Swastik Hospital</h2>
            <p className="apt-slip-tagline">Appointment Slip</p>
            <hr />
            <p><strong>Appointment ID:</strong> {printAppointment.id}</p>
            <p><strong>Patient:</strong> {printAppointment.patientName}</p>
            <p><strong>Phone:</strong> {printAppointment.phone || "—"}</p>
            <p><strong>Doctor:</strong> {getDoctorName(printAppointment.doctorId)}</p>
            <p><strong>Department:</strong> {getDepartmentName(printAppointment.departmentId)}</p>
            <p><strong>Date:</strong> {printAppointment.date}</p>
            <p><strong>Time:</strong> {printAppointment.timeSlot}</p>
            <p><strong>Status:</strong> {printAppointment.status}</p>
            <hr />
            <p className="apt-slip-footer">Please bring this slip at the time of visit. | Swastik Hospital</p>
          </div>
        </div>
      )}
    </div>
  );
}

function RescheduleModal({ appointment, appointments, doctors, onSave, onClose }) {
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTimeSlot, setNewTimeSlot] = useState(appointment.timeSlot);

  const bookedSlots = useMemo(() => {
    const set = new Set();
    appointments.forEach((a) => {
      if (
        a.id !== appointment.id &&
        a.date === newDate &&
        String(a.doctorId) === String(appointment.doctorId) &&
        a.status !== "Cancelled"
      ) {
        set.add(a.timeSlot);
      }
    });
    return set;
  }, [appointments, appointment.id, appointment.doctorId, newDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookedSlots.has(newTimeSlot)) return;
    onSave(appointment, newDate, newTimeSlot);
  };

  return (
    <div className="apt-modal-overlay" onClick={onClose}>
      <div className="apt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="apt-modal-header">
          <h3>Reschedule Appointment</h3>
          <button type="button" className="apt-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <p className="apt-modal-subtitle">{appointment.id} – {appointment.patientName}</p>
        <form onSubmit={handleSubmit}>
          <div className="apt-form-row">
            <label>Date</label>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
          </div>
          <div className="apt-form-row">
            <label>Time Slot</label>
            <select value={newTimeSlot} onChange={(e) => setNewTimeSlot(e.target.value)} required>
              {TIME_SLOTS.map((slot) => {
                const disabled = bookedSlots.has(slot);
                return (
                  <option key={slot} value={slot} disabled={disabled}>
                    {slot}{disabled ? " (Booked)" : ""}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="apt-modal-footer">
            <button type="button" className="impl-btn impl-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="impl-btn impl-btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Appointments;
