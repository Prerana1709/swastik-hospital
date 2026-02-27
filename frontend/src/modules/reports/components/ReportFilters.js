// Reusable report filters: date range, department, doctor, program type. Bahmni-style audit-ready params.
import React from 'react';

const DEFAULT_DEPARTMENTS = [
  { value: '', label: 'All Departments' },
  { value: 'general', label: 'General Medicine' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'icu', label: 'ICU' },
];

const DEFAULT_DOCTORS = [
  { value: '', label: 'All Doctors' },
  { value: 'chougule', label: 'Dr. P. M. Chougule' },
  { value: 'sharma', label: 'Dr. Priya Sharma' },
  { value: 'nair', label: 'Dr. Suresh Nair' },
  { value: 'patel', label: 'Dr. Anjali Patel' },
];

const DEFAULT_PROGRAM_TYPES = [
  { value: '', label: 'All Programs' },
  { value: 'cbt', label: 'CBT' },
  { value: 'dbt', label: 'DBT' },
  { value: 'ipd', label: 'IPD / Inpatient' },
  { value: 'opd', label: 'OPD / Outpatient' },
  { value: 'daycare', label: 'Day Care' },
  { value: 'rehab', label: 'Rehabilitation' },
];

const toDateInput = (d) => {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
};

const ReportFilters = ({
  dateFrom,
  dateTo,
  department,
  doctor,
  programType,
  onDateFromChange,
  onDateToChange,
  onDepartmentChange,
  onDoctorChange,
  onProgramTypeChange,
  showDepartment = true,
  showDoctor = false,
  showProgramType = false,
  departments = DEFAULT_DEPARTMENTS,
  doctors = DEFAULT_DOCTORS,
  programTypes = DEFAULT_PROGRAM_TYPES,
}) => (
  <div className="report-filters">
    <div className="report-filters-row">
      <div className="report-filter-group">
        <label>From date</label>
        <input
          type="date"
          value={toDateInput(dateFrom)}
          onChange={(e) => onDateFromChange && onDateFromChange(e.target.value ? new Date(e.target.value) : null)}
          aria-label="Filter from date"
        />
      </div>
      <div className="report-filter-group">
        <label>To date</label>
        <input
          type="date"
          value={toDateInput(dateTo)}
          onChange={(e) => onDateToChange && onDateToChange(e.target.value ? new Date(e.target.value) : null)}
          aria-label="Filter to date"
        />
      </div>
      {showDepartment && (
        <div className="report-filter-group">
          <label>Department</label>
          <select
            value={department || ''}
            onChange={(e) => onDepartmentChange && onDepartmentChange(e.target.value)}
            aria-label="Filter by department"
          >
            {departments.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
      {showDoctor && (
        <div className="report-filter-group">
          <label>Doctor</label>
          <select
            value={doctor || ''}
            onChange={(e) => onDoctorChange && onDoctorChange(e.target.value)}
            aria-label="Filter by doctor"
          >
            {doctors.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
      {showProgramType && (
        <div className="report-filter-group">
          <label>Program type</label>
          <select
            value={programType || ''}
            onChange={(e) => onProgramTypeChange && onProgramTypeChange(e.target.value)}
            aria-label="Filter by program type"
          >
            {programTypes.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  </div>
);

export default ReportFilters;
export { DEFAULT_DEPARTMENTS, DEFAULT_DOCTORS, DEFAULT_PROGRAM_TYPES };
