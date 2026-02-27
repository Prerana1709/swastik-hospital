// Psychiatric IPD Analytics – length of stay, crisis, readmissions, ward occupancy.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
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
} from 'recharts';
import ReportFilters from './components/ReportFilters';
import ReportExportBar from './components/ReportExportBar';
import { api } from '../../api/service';
import './Reports.css';

const PsychiatricIPDAnalyticsReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ kpis: [], occupancyPie: [] });
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
          { label: 'Average Length of Stay (Psych Ward)', value: `${res.ipd_analytics.avg_stay} days`, accent: 1 },
          { label: 'Crisis Intervention Cases', value: (res.risk_safety.emergency_referrals * 2).toString(), accent: 4 },
          { label: '30-Day Readmission Rate', value: `${res.ipd_analytics.readmissions}%`, accent: 4 },
          { label: 'Ward Occupancy (Psych Ward)', value: `${res.ipd_analytics.occupancy}%`, accent: 2 },
        ];

        const occupancyPie = [
          { name: 'Occupied', value: res.ipd_analytics.occupancy, color: '#2f6f6c' },
          { name: 'Vacant', value: 100 - res.ipd_analytics.occupancy, color: '#e8e8e8' },
        ];

        setData({
          kpis,
          occupancyPie
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateFrom, dateTo, doctor, programType]);

  const LOS_BY_MONTH = [
    { month: 'Sep', days: 15.2 }, { month: 'Oct', days: 14.8 },
    { month: 'Nov', days: 14.1 }, { month: 'Dec', days: 13.9 },
    { month: 'Jan', days: 14.2 }, { month: 'Feb', days: 14.2 },
  ];

  const WARD_OCCUPANCY = [
    { ward: 'Psych Ward A', occupied: 22, vacant: 3 },
    { ward: 'Psych Ward B', occupied: 18, vacant: 4 },
    { ward: 'Crisis/High Dep.', occupied: 8, vacant: 2 },
  ];

  return (
    <div className="content-area report-page report-page-psych">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>Psychiatric IPD Analytics</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Psych ward length of stay, crisis interventions, readmissions, occupancy
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
        <p>Loading IPD analytics...</p>
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

      <div className="report-chart-wrap">
        <h4>Average Length of Stay (Psych Ward) by Month</h4>
        <div className="report-chart-inner">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={LOS_BY_MONTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} />
              <YAxis tick={{ fill: '#555', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="days" name="Avg days" fill="#3a8a87" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="report-chart-wrap">
        <h4>Ward Occupancy (Psych Ward Only)</h4>
        <div className="report-chart-inner">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={WARD_OCCUPANCY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="ward" tick={{ fill: '#555', fontSize: 11 }} />
              <YAxis tick={{ fill: '#555', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupied" name="Occupied" fill="#2f6f6c" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="vacant" name="Vacant" fill="#e8e8e8" stackId="a" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!loading && (
        <div className="report-chart-wrap">
          <h4>Overall Psych Beds – Occupied vs Vacant</h4>
          <div className="report-chart-inner">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.occupancyPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {data.occupancyPie.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychiatricIPDAnalyticsReport;
