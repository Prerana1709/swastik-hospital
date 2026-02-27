// Medication Compliance Analytics – antidepressants, antipsychotics, mood stabilizers, missed follow-ups.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
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

const MedicationComplianceReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ kpis: [], antidepressantDist: [], antipsychoticByDrug: [], complianceByMonth: [] });
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
          { label: 'Antidepressant Usage (active Rx)', value: res.mental_health_kpis[2].value, accent: 1 },
          { label: 'Antipsychotic Usage (active Rx)', value: res.mental_health_kpis[3].value, accent: 2 },
          { label: 'Mood Stabilizer Compliance', value: '89%', accent: 5 },
          { label: 'Missed Follow-up Count', value: res.risk_safety.self_harm_risk.toString(), accent: 4 },
        ];

        const antidepressantDist = [
          { name: 'SSRIs', value: 165, color: '#2f6f6c' },
          { name: 'SNRIs', value: 72, color: '#3a8a87' },
          { name: 'Others', value: 49, color: '#4ba3a0' },
        ];
        const antipsychoticByDrug = [
          { drug: 'Risperidone', count: 42 },
          { drug: 'Olanzapine', count: 38 },
          { drug: 'Quetiapine', count: 28 },
          { drug: 'Aripiprazole', count: 16 },
        ];
        const complianceByMonth = [
          { month: 'Sep', compliance: 85 }, { month: 'Oct', compliance: 86 },
          { month: 'Nov', compliance: 87 }, { month: 'Dec', compliance: 88 },
          { month: 'Jan', compliance: 89 }, { month: 'Feb', compliance: 89 },
        ];

        setData({ kpis, antidepressantDist, antipsychoticByDrug, complianceByMonth });
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
      <h3>Medication Compliance Analytics</h3>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Antidepressants, antipsychotics, mood stabilizers, missed follow-ups
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
        <p>Loading medication analytics...</p>
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
            <h4>Antidepressant Usage Distribution</h4>
            <div className="report-chart-inner">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.antidepressantDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.antidepressantDist.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-chart-wrap">
            <h4>Antipsychotic Usage by Drug</h4>
            <div className="report-chart-inner">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.antipsychoticByDrug}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="drug" tick={{ fill: '#555', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#555', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Patients" fill="#3a8a87" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-chart-wrap">
            <h4>Mood Stabilizer Compliance Trend</h4>
            <div className="report-chart-inner">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.complianceByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#555', fontSize: 12 }} domain={[80, 95]} />
                  <Tooltip />
                  <Bar dataKey="compliance" name="Compliance %" fill="#28a745" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicationComplianceReport;
