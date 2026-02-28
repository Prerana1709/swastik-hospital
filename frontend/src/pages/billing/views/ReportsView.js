import React from "react";
import { reportRevenueTrend, reportStatusBreakdown, reportPaymentMethods } from "../billingDummyData";

const maxRevenue = Math.max(...reportRevenueTrend.map((d) => d.value));

function ReportsView() {
  return (
    <div className="billing-content">
      <div className="billing-card">
        <h2 className="billing-card__heading">Revenue Trend (₹ in thousands)</h2>
        <div className="reports-chart reports-chart--bars">
          {reportRevenueTrend.map((d) => (
            <div key={d.month} className="reports-chart__bar-wrap">
              <div
                className="reports-chart__bar"
                style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                title={`${d.month}: ${d.value}`}
              />
              <span className="reports-chart__label">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="reports-row">
        <div className="billing-card">
          <h2 className="billing-card__heading">Invoice Status</h2>
          <div className="reports-chart reports-chart--donut">
            {reportStatusBreakdown.map((d) => (
              <div key={d.label} className="reports-chart__legend-item">
                <span className="reports-chart__dot" style={{ background: d.color }} />
                <span>{d.label}: {d.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="billing-card">
          <h2 className="billing-card__heading">Payment Methods</h2>
          <div className="reports-chart reports-chart--donut">
            {reportPaymentMethods.map((d) => (
              <div key={d.label} className="reports-chart__legend-item">
                <span className="reports-chart__dot" style={{ background: d.color }} />
                <span>{d.label}: {d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsView;
