// Embeds Crater (invoicing app) in the same tab. Set REACT_APP_CRATER_URL in .env (e.g. http://localhost).
import React from "react";

const CRATER_URL = (process.env.REACT_APP_CRATER_URL || "http://localhost").trim();

function Billing() {
  if (!CRATER_URL) {
    return (
      <div className="billing-open-wrap">
        <h2>Payment & Billing</h2>
        <p>Set <code>REACT_APP_CRATER_URL</code> in <code>.env</code> (e.g. <code>http://localhost</code>) and restart the app.</p>
      </div>
    );
  }

  return (
    <div className="billing-crater-embed">
      <iframe
        title="Crater – Payment & Billing"
        src={CRATER_URL}
        className="billing-crater-iframe"
      />
    </div>
  );
}

export default Billing;
