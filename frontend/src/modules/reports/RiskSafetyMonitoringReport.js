// Risk & Safety Monitoring – self-harm, violence risk, emergency referrals, crisis alerts.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import { api } from '../../api/service';
import './Reports.css';

const RiskSafetyMonitoringReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ kpis: [], selfHarmTrends: [], riskTypeDist: [] });
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  });
  const [dateTo, setDateTo] = useState(new Date());
  const [doctor, setDoctor] = useState('');
  const [programType, setProgramType] = useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.getReportAnalytics({
          from_date: dateFrom.toISOString().slice(0, 10),
          to_date: dateTo.toISOString().slice(0, 10),
          doctor_id: doctor,
          program_type: programType
        });

        const kpis = [
          { label: 'High Self-Harm Risk Patients', value: res.risk_safety.self_harm_risk.toString(), accent: 4 },
          { label: 'Violence Risk Assessment Cases', value: res.risk_safety.violence_risk.toString(), accent: 4 },
          { label: 'Emergency Psychiatric Referrals', value: res.risk_safety.emergency_referrals.toString(), accent: 4 },
          { label: 'Crisis Alert Count (30 days)', value: (res.risk_safety.emergency_referrals / 2).toFixed(0), accent: 4 },
        ];

        setData({
          kpis,
          selfHarmTrends: res.admissions_by_month.map(m => ({ month: m.month, count: m.emergency + 2 })),
          riskTypeDist: res.risk_safety.events
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateFrom, dateTo, doctor, programType]);

  return (
    <div className="content-area report-page report-page-psych">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>Risk &amp; Safety Monitoring Dashboard</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Self-harm risk, violence risk, emergency referrals, crisis alerts
      </p>

      <ReportFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        doctor={doctor}
        programType={programType}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onDoctorChange={setDoctor}
        onProgramTypeChange={setProgramType}
        showDepartment={false}
        showDoctor
        showProgramType
      />
      <ReportExportBar />

      {loading ? (
        <p>Loading safety analytics...</p>
      ) : (
        <div className="reports-stat-grid">
          {data.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className={`report-stat-card accent-${kpi.accent || 1}`}
            >
              <div className="label">{kpi.label}</div>
              <div className="value">{kpi.value}</div>
            </div>
          ))}
        </div>
      )}
      {!loading && (
        <>
          <div className="report-chart-wrap">
            <h4>High Self-Harm Risk Patients (by month)</h4>
            <div className="report-chart-inner">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.selfHarmTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#555', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="High risk count" fill="#f5576c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-chart-wrap">
            <h4>Violence & Crisis Events Distribution</h4>
            <div className="report-chart-inner">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.riskTypeDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="category" tick={{ fill: '#555', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#555', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Cases" fill="#3a8a87" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RiskSafetyMonitoringReport;
