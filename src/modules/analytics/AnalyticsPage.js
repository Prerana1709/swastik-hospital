// Standalone Analytics page. Route: /analytics.
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { FaArrowLeft, FaChartLine, FaNotesMedical, FaFlask, FaRupeeSign, FaCogs } from "react-icons/fa";
import KPIBox from "./components/KPIBox";
import ExportButtons from "./components/ExportButtons";
import ChartsSection from "./components/ChartsSection";
import "./AnalyticsPage.css";

import swastikLogo from "../../assets/swastiklogo.png";
import DashboardFooter from "../../components/Footer/DashboardFooter";
import HospitalInfo from "../../components/HospitalInfo/HospitalInfo";

const DEPRESSION_TREND = [
  { month: "Sep", phq9_avg: 12, cases: 48 }, { month: "Oct", phq9_avg: 11, cases: 52 },
  { month: "Nov", phq9_avg: 10, cases: 55 }, { month: "Dec", phq9_avg: 11, cases: 58 },
  { month: "Jan", phq9_avg: 10, cases: 62 }, { month: "Feb", phq9_avg: 9, cases: 60 },
];
const DIAGNOSIS_DISTRIBUTION = [
  { name: "Depression", value: 32, color: "#2f6f6c" },
  { name: "Anxiety", value: 28, color: "#3a8a87" },
  { name: "Psychosis", value: 14, color: "#4ba3a0" },
  { name: "Substance Use", value: 12, color: "#5cbcb9" },
  { name: "Other", value: 14, color: "#6dd5d2" },
];
const LAST_7_DAYS = [
  { day: "Mon", visits: 42 }, { day: "Tue", visits: 58 }, { day: "Wed", visits: 55 },
  { day: "Thu", visits: 62 }, { day: "Fri", visits: 68 }, { day: "Sat", visits: 28 }, { day: "Sun", visits: 22 },
];
const REVENUE_6_MONTHS = [
  { month: "Sep", revenue: 8.2 }, { month: "Oct", revenue: 8.8 }, { month: "Nov", revenue: 9.1 },
  { month: "Dec", revenue: 9.5 }, { month: "Jan", revenue: 9.8 }, { month: "Feb", revenue: 10.2 },
];
const OPD_VS_IPD = [
  { week: "W1", opd: 285, ipd: 42 }, { week: "W2", opd: 298, ipd: 45 },
  { week: "W3", opd: 272, ipd: 48 }, { week: "W4", opd: 310, ipd: 44 },
];

const SIDEBAR_ITEMS = [
  { id: "overview", label: "Overview", icon: <FaChartLine /> },
  { id: "clinical", label: "Clinical", icon: <FaNotesMedical /> },
  { id: "lab", label: "Lab", icon: <FaFlask /> },
  { id: "financial", label: "Financial", icon: <FaRupeeSign /> },
  { id: "operational", label: "Operational", icon: <FaCogs /> },
];

function AnalyticsPage() {
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  });
  const [dateTo, setDateTo] = useState(new Date());

  const patientsToday = useMemo(() => 68, []);
  const opdToday = useMemo(() => 54, []);
  const revenueToday = useMemo(() => 185000, []);
  const suicideRiskCases = useMemo(() => 5, []);
  const therapyCompletionRate = useMemo(() => "78%", []);

  return (
    <div className="analytics-layout">
      <header className="analytics-header">
        <div className="analytics-header-left">
          <button type="button" className="analytics-back-btn" onClick={() => navigate("/")} aria-label="Back to Dashboard">
            <FaArrowLeft /> Back to Home
          </button>
          <img src={swastikLogo} alt="Swastik Hospital" className="analytics-header-logo" />
          <div className="analytics-header-title-wrap">
            <h1 className="analytics-header-title">Psychiatric Hospital Analytics</h1>
            <p className="analytics-header-subtitle">Swastik Hospital · Psychiatry & Therapy Insights</p>
            <HospitalInfo variant="compact" showIcons={true} />
          </div>
        </div>
        <div className="analytics-header-right">
          <div className="analytics-header-filters">
            <span className="analytics-header-filter-label">Date range</span>
            <input
              type="date"
              value={dateFrom.toISOString().slice(0, 10)}
              onChange={(e) => setDateFrom(e.target.value ? new Date(e.target.value) : dateFrom)}
              className="analytics-header-date"
            />
            <span className="analytics-header-date-sep">–</span>
            <input
              type="date"
              value={dateTo.toISOString().slice(0, 10)}
              onChange={(e) => setDateTo(e.target.value ? new Date(e.target.value) : dateTo)}
              className="analytics-header-date"
            />
          </div>
          <ExportButtons />
        </div>
      </header>

      <div className="analytics-body">
        <aside className="analytics-sidebar">
          <nav className="analytics-sidebar-nav">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`analytics-sidebar-item ${section === item.id ? "active" : ""}`}
                onClick={() => setSection(item.id)}
              >
                <span className="analytics-sidebar-icon">{item.icon}</span>
                <span className="analytics-sidebar-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="analytics-main">
          {section === "overview" && (
            <div className="analytics-content">
              <div className="analytics-kpi-grid">
                <KPIBox title="Suicide Risk Cases (Active)" value={suicideRiskCases} accent="1" />
                <KPIBox title="Therapy Completion Rate" value={therapyCompletionRate} accent="2" />
                <KPIBox title="OPD Visits Today" value={opdToday} accent="3" />
                <KPIBox title="Revenue Today" value={`₹${(revenueToday / 1000).toFixed(0)}K`} accent="4" />
              </div>
              <ChartsSection title="Depression Trend (PHQ-9 avg & cases)" insight="Average PHQ-9 improving; case load stable.">
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={DEPRESSION_TREND} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" tick={{ fill: "#555", fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fill: "#555", fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "#555", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e8e8e8" }} />
                    <Bar yAxisId="left" dataKey="cases" fill="#2f6f6c" name="Cases" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="phq9_avg" stroke="#3a8a87" strokeWidth={2} name="PHQ-9 avg" dot={{ fill: "#3a8a87" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartsSection>
              <ChartsSection title="Patient Visits (Last 7 Days)" insight="OPD psychiatric visits.">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={LAST_7_DAYS} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#555", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e8e8e8" }} />
                    <Bar dataKey="visits" fill="#2f6f6c" name="Visits" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartsSection>
            </div>
          )}

          {section === "clinical" && (
            <div className="analytics-content">
              <div className="analytics-charts-grid two-cols">
                <ChartsSection title="Diagnosis Distribution (Psychiatric)">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={DIAGNOSIS_DISTRIBUTION}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {DIAGNOSIS_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartsSection>
                <ChartsSection title="OPD vs IPD (Psychiatric)">
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={OPD_VS_IPD} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="week" tick={{ fill: "#555", fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fill: "#555", fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#555", fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e8e8e8" }} />
                      <Bar yAxisId="left" dataKey="opd" fill="#2f6f6c" name="OPD" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="ipd" stroke="#3a8a87" strokeWidth={2} name="IPD" dot={{ fill: "#3a8a87" }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartsSection>
              </div>
            </div>
          )}

          {section === "lab" && (
            <div className="analytics-content">
              <div className="analytics-kpi-grid">
                <KPIBox title="Samples Today" value="42" accent="1" />
                <KPIBox title="Pending Results" value="18" accent="2" />
                <KPIBox title="Avg TAT (hrs)" value="4.2" accent="3" />
                <KPIBox title="Critical Alerts" value="2" accent="4" />
              </div>
              <ChartsSection title="Lab Volume (Last 7 Days)" insight="Psychiatric-relevant tests.">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={LAST_7_DAYS} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#555", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e8e8e8" }} />
                    <Bar dataKey="visits" fill="#2f6f6c" name="Samples" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartsSection>
            </div>
          )}

          {section === "financial" && (
            <div className="analytics-content">
              <div className="analytics-kpi-grid">
                <KPIBox title="Revenue (MTD)" value="₹12.4L" accent="1" />
                <KPIBox title="Outstanding" value="₹2.1L" accent="2" />
                <KPIBox title="Collection %" value="94%" accent="3" />
                <KPIBox title="OPD Share" value="68%" accent="4" />
              </div>
              <ChartsSection title="Revenue Trend" insight="Revenue up 8% MoM.">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={REVENUE_6_MONTHS} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" tick={{ fill: "#555", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#555", fontSize: 12 }} unit=" L" />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e8e8e8" }} />
                    <Line type="monotone" dataKey="revenue" stroke="#2f6f6c" strokeWidth={2} name="Revenue (Lakhs)" dot={{ fill: "#2f6f6c" }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartsSection>
            </div>
          )}

          {section === "operational" && (
            <div className="analytics-content">
              <div className="analytics-kpi-grid">
                <KPIBox title="Avg Consultation Time" value="18 min" accent="1" />
                <KPIBox title="Appointment No-Show %" value="6%" accent="2" />
                <KPIBox title="Bed Occupancy Rate" value="87%" accent="3" />
                <KPIBox title="Discharge Rate (MTD)" value="42" accent="4" />
              </div>
              <ChartsSection title="OPD vs IPD Comparison">
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={OPD_VS_IPD} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="week" tick={{ fill: "#555", fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fill: "#555", fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "#555", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e8e8e8" }} />
                    <Bar yAxisId="left" dataKey="opd" fill="#2f6f6c" name="OPD" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="ipd" stroke="#3a8a87" strokeWidth={2} name="IPD" dot={{ fill: "#3a8a87" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartsSection>
            </div>
          )}
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
}

export default AnalyticsPage;
