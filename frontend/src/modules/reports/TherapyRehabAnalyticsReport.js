// Therapy & Rehabilitation Analytics – sessions, improvement, completion, dropout.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import { api } from '../../api/service';
import './Reports.css';

const TherapyRehabAnalyticsReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ kpis: [], completionTrends: [] });
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
          { label: 'Total Therapy Sessions Completed', value: res.therapy_rehab.sessions_completed.toLocaleString(), accent: 1 },
          { label: 'Improvement Percentage', value: `${res.therapy_rehab.improvement_rate}%`, accent: 5 },
          { label: 'Rehab Program Completion Rate', value: `${100 - res.therapy_rehab.dropout_rate}%`, accent: 5 },
          { label: 'Dropout Rate', value: `${res.therapy_rehab.dropout_rate}%`, accent: 4 },
          { label: 'Average Sessions Per Patient', value: (res.therapy_rehab.sessions_completed / 10).toFixed(1), accent: 2 },
        ];

        setData({
          kpis,
          completionTrends: res.therapy_rehab.completion_trends
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateFrom, dateTo, doctor, programType]);

  const SESSIONS_BY_MONTH = [
    { month: 'Sep', sessions: 186 }, { month: 'Oct', sessions: 198 },
    { month: 'Nov', sessions: 212 }, { month: 'Dec', sessions: 205 },
    { month: 'Jan', sessions: 224 }, { month: 'Feb', sessions: 223 },
  ];

  return (
    <div className="content-area report-page report-page-psych">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>Therapy &amp; Rehabilitation Analytics</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Sessions, improvement, completion and dropout rates
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
        <p>Loading therapy analytics...</p>
      ) : (
        <div className="reports-stat-grid">
          {data.kpis.map((kpi, i) => (
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

      <div className="report-chart-wrap">
        <h4>Therapy Sessions Completed by Month</h4>
        <div className="report-chart-inner">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={SESSIONS_BY_MONTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} />
              <YAxis tick={{ fill: '#555', fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#2f6f6c" strokeWidth={2} dot={{ fill: '#2f6f6c' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="report-chart-wrap">
        <h4>Program Completion vs Dropout by Program Type</h4>
        <div className="report-chart-inner">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.completionTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} />
              <YAxis tick={{ fill: '#555', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" name="Completed" fill="#28a745" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dropout" name="Dropped" fill="#f5576c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TherapyRehabAnalyticsReport;
