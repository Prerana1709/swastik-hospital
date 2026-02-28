/**
 * Dummy data for Billing ERP demo – invoices, payments, clients, reports.
 * Used for Dashboard, Invoices, Payments, Clients, Reports views.
 */

const STATUSES = { PAID: "Paid", PENDING: "Pending", OVERDUE: "Overdue", DRAFT: "Draft" };
const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Insurance"];

const dummyPatients = [
  { uhid: "SWH2024001", fullName: "Ramesh Kumar", contact: "9876543210", totalBilled: 24500, totalPaid: 22000, outstanding: 2500 },
  { uhid: "SWH2024002", fullName: "Priya Sharma", contact: "9876543211", totalBilled: 18500, totalPaid: 18500, outstanding: 0 },
  { uhid: "SWH2024003", fullName: "Vikram Singh", contact: "9876543212", totalBilled: 42000, totalPaid: 35000, outstanding: 7000 },
  { uhid: "SWH2024004", fullName: "Anita Desai", contact: "9876543213", totalBilled: 12000, totalPaid: 8000, outstanding: 4000 },
  { uhid: "SWH2024005", fullName: "Suresh Patel", contact: "9876543214", totalBilled: 31000, totalPaid: 31000, outstanding: 0 },
];

const dummyInvoices = [
  { id: "1", invoiceNumber: "SWH-20240228-0001", patientName: "Ramesh Kumar", uhid: "SWH2024001", issueDate: "2024-02-28", dueDate: "2024-03-14", status: STATUSES.PAID, amount: 5200 },
  { id: "2", invoiceNumber: "SWH-20240227-0002", patientName: "Priya Sharma", uhid: "SWH2024002", issueDate: "2024-02-27", dueDate: "2024-03-13", status: STATUSES.PAID, amount: 3500 },
  { id: "3", invoiceNumber: "SWH-20240226-0003", patientName: "Vikram Singh", uhid: "SWH2024003", issueDate: "2024-02-26", dueDate: "2024-03-12", status: STATUSES.PENDING, amount: 12000 },
  { id: "4", invoiceNumber: "SWH-20240225-0004", patientName: "Anita Desai", uhid: "SWH2024004", issueDate: "2024-02-25", dueDate: "2024-03-11", status: STATUSES.OVERDUE, amount: 4000 },
  { id: "5", invoiceNumber: "SWH-20240224-0005", patientName: "Suresh Patel", uhid: "SWH2024005", issueDate: "2024-02-24", dueDate: "2024-03-10", status: STATUSES.PAID, amount: 8500 },
  { id: "6", invoiceNumber: "SWH-20240223-0006", patientName: "Ramesh Kumar", uhid: "SWH2024001", issueDate: "2024-02-23", dueDate: "2024-03-09", status: STATUSES.DRAFT, amount: 2100 },
];

const dummyPayments = [
  { id: "p1", date: "2024-02-28", invoiceNumber: "SWH-20240228-0001", patientName: "Ramesh Kumar", method: "UPI", amount: 5200, status: "Completed" },
  { id: "p2", date: "2024-02-27", invoiceNumber: "SWH-20240227-0002", patientName: "Priya Sharma", method: "Card", amount: 3500, status: "Completed" },
  { id: "p3", date: "2024-02-26", invoiceNumber: "SWH-20240226-0003", patientName: "Vikram Singh", method: "Cash", amount: 5000, status: "Partial" },
  { id: "p4", date: "2024-02-25", invoiceNumber: "SWH-20240224-0005", patientName: "Suresh Patel", method: "Insurance", amount: 4500, status: "Completed" },
  { id: "p5", date: "2024-02-24", invoiceNumber: "SWH-20240224-0005", patientName: "Suresh Patel", method: "Cash", amount: 4000, status: "Completed" },
];

const dashboardMetrics = {
  totalInvoices: 128,
  paid: 96,
  pending: 22,
  overdue: 10,
  revenue: 1245800,
  outstanding: 210450,
};

const reportRevenueTrend = [
  { month: "Sep", value: 185 },
  { month: "Oct", value: 210 },
  { month: "Nov", value: 198 },
  { month: "Dec", value: 245 },
  { month: "Jan", value: 272 },
  { month: "Feb", value: 295 },
];

const reportStatusBreakdown = [
  { label: "Paid", count: 96, color: "#059669" },
  { label: "Pending", count: 22, color: "#d97706" },
  { label: "Overdue", count: 10, color: "#b91c1c" },
];

const reportPaymentMethods = [
  { label: "Cash", count: 42, color: "#0f766e" },
  { label: "UPI", count: 38, color: "#1a5f5c" },
  { label: "Card", count: 28, color: "#2f6f6c" },
  { label: "Insurance", count: 20, color: "#64748b" },
];

export {
  STATUSES,
  PAYMENT_METHODS,
  dummyPatients,
  dummyInvoices,
  dummyPayments,
  dashboardMetrics,
  reportRevenueTrend,
  reportStatusBreakdown,
  reportPaymentMethods,
};
