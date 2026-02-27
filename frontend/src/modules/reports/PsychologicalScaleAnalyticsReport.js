// Psychological Scale Analytics – PHQ-9, GAD-7, MSE, cognitive trends.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
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

const PsychologicalScaleAnalyticsReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ phq9Distribution: [], gad7Trends: [], mseAbnormal: [] });
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
          phq9Distribution: res.scale_analytics.phq9_distribution,
          gad7Trends: res.scale_analytics.gad7_trends,
          mseAbnormal: res.scale_analytics.mse_abnormal
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateFrom, dateTo, doctor, programType]);

  const COGNITIVE_TREND = [
    { month: 'Sep', score: 72 }, { month: 'Oct', score: 74 },
    { month: 'Nov', score: 75 }, { month: 'Dec', score: 76 },
    { month: 'Jan', score: 77 }, { month: 'Feb', score: 78 },
  ];

  return (
    <div className="content-area report-page report-page-psych">
      <Link to="/reports" className="report-back">
        <FaArrowLeft /> Back to Reports
      </Link>
      <h3>Psychological Scale Analytics</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        PHQ-9, GAD-7, Mental Status Examination, cognitive function
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
        <p>Loading scale analytics...</p>
      ) : (
        <>
          <div className="report-chart-wrap">
            <h4>PHQ-9 Score Distribution (Mild / Moderate / Severe)</h4>
            <div className="report-chart-inner">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.phq9Distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.phq9Distribution.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-chart-wrap">
            <h4>GAD-7 Trends (Average Score)</h4>
            <div className="report-chart-inner">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.gad7Trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#555', fontSize: 12 }} domain={[8, 14]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avg" name="GAD-7 avg" stroke="#2f6f6c" strokeWidth={2} dot={{ fill: '#2f6f6c' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-chart-wrap">
            <h4>Mental Status Examination – Abnormal Findings</h4>
            <div className="report-chart-inner">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.mseAbnormal} layout="vertical" margin={{ left: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tick={{ fill: '#555', fontSize: 12 }} />
                  <YAxis type="category" dataKey="finding" tick={{ fill: '#555', fontSize: 12 }} width={110} />
                  <Tooltip />
                  <Bar dataKey="count" name="Count" fill="#3a8a87" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      <div className="report-chart-wrap">
        <h4>Cognitive Function Score Trends</h4>
        <div className="report-chart-inner">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={COGNITIVE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} />
              <YAxis tick={{ fill: '#555', fontSize: 12 }} domain={[65, 85]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" name="Avg cognitive score" stroke="#4ba3a0" strokeWidth={2} dot={{ fill: '#4ba3a0' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PsychologicalScaleAnalyticsReport;
