// Mental Health Overview – KPIs and psychiatric dashboard.
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
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import { api } from '../../api/service';
import './Reports.css';

const MentalHealthOverviewReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ kpis: [], admissionsByMonth: [] });
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
        setData({
          kpis: res.mental_health_kpis,
          admissionsByMonth: res.admissions_by_month
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
      <h3>Mental Health Overview Dashboard</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Psychiatric &amp; mental health KPIs · Swastik Hospital
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
        <p>Loading analytics...</p>
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
        <h4>Emergency vs Planned Psychiatric Admissions (by month)</h4>
        <div className="report-chart-inner">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.admissionsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} />
              <YAxis tick={{ fill: '#555', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="emergency" name="Emergency" fill="#f5576c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="planned" name="Planned" fill="#2f6f6c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthOverviewReport;
