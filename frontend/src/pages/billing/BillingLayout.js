import React, { useState, useCallback, useEffect } from "react";
import BillingSidebar from "./BillingSidebar";
import DashboardView from "./views/DashboardView";
import InvoicesView from "./views/InvoicesView";
import CreateInvoiceView from "./views/CreateInvoiceView";
import PaymentsView from "./views/PaymentsView";
import ClientsView from "./views/ClientsView";
import ReportsView from "./views/ReportsView";
import SettingsView from "./views/SettingsView";
import { dashboardMetrics } from "./billingDummyData";
import { api } from "../../api/service";
import "./BillingDashboard.css";

const WS_BASE = (() => {
  try {
    const u = new URL(process.env.REACT_APP_API_URL || "http://localhost:8000");
    return `${u.protocol === "https:" ? "wss" : "ws"}://${u.host}`;
  } catch {
    return "ws://localhost:8000";
  }
})();

const VIEW_TITLES = {
  dashboard: "Dashboard",
  invoices: "Invoices",
  create: "Create Invoice",
  payments: "Payments",
  clients: "Clients (Patients)",
  reports: "Reports",
  settings: "Settings",
};

function BillingLayout({ userName, onLogout }) {
  const [currentView, setCurrentView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [metrics, setMetrics] = useState(dashboardMetrics);

  const loadMetrics = useCallback(async () => {
    try {
      const stats = await api.getBillingStats();
      setMetrics((m) => ({
        ...m,
        revenue: stats.revenue_today ?? m.revenue,
        outstanding: stats.outstanding ?? m.outstanding,
      }));
    } catch {
      setMetrics((m) => m);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/billing`);
    ws.onmessage = (ev) => {
      try {
        const { event } = JSON.parse(ev.data || "{}");
        if (event === "bill_created" || event === "payment_updated") loadMetrics();
      } catch {}
    };
    return () => { if (ws.readyState === WebSocket.OPEN) ws.close(); };
  }, [loadMetrics]);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView metrics={metrics} />;
      case "invoices":
        return <InvoicesView />;
      case "create":
        return <CreateInvoiceView />;
      case "payments":
        return <PaymentsView />;
      case "clients":
        return <ClientsView />;
      case "reports":
        return <ReportsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView metrics={metrics} />;
    }
  };

  return (
    <div className="billing-layout">
      <BillingSidebar
        currentView={currentView}
        onSelect={(id) => { setCurrentView(id); setSidebarOpen(false); }}
        sidebarOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="billing-main">
        <header className="billing-header">
          <button type="button" className="billing-header__menu" onClick={() => setSidebarOpen(true)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <h1 className="billing-header__title">{VIEW_TITLES[currentView] || "Dashboard"}</h1>
          <div className="billing-header__right">
            <input
              type="text"
              className="billing-header__search"
              placeholder="Search..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
            />
            <button type="button" className="billing-header__icon" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            </button>
            <span className="billing-header__user">{userName || "Billing User"}</span>
            <button type="button" className="billing-btn billing-btn--primary billing-btn--sm" onClick={onLogout}>Logout</button>
          </div>
        </header>

        <div className="billing-content-area">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default BillingLayout;
