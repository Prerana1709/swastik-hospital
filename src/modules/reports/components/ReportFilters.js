// Reusable report filters: date range and department. Bahmni-style audit-ready params.
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

const toDateInput = (d) => {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
};

const ReportFilters = ({
  dateFrom,
  dateTo,
  department,
  onDateFromChange,
  onDateToChange,
  onDepartmentChange,
  showDepartment = true,
  departments = DEFAULT_DEPARTMENTS,
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
    </div>
  </div>
);

export default ReportFilters;
export { DEFAULT_DEPARTMENTS };
