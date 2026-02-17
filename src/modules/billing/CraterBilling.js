// Loads your existing Crater instance in an iframe.
const craterUrl = process.env.REACT_APP_CRATER_URL || "";

function CraterBilling() {
  if (!craterUrl.trim()) {
    return (
      <div className="billing-crater-setup" style={{ padding: "2rem", maxWidth: "560px" }}>
        <h2>Payment & Billing (Crater)</h2>
        <p>Crater is not configured. Set <code>REACT_APP_CRATER_URL</code> in <code>.env</code> and restart.</p>
      </div>
    );
  }

  return (
    <div className="billing-crater-embed">
      <iframe
        title="Crater – Payment & Billing"
        src={craterUrl}
        className="billing-crater-iframe"
      />
    </div>
  );
}

export default CraterBilling;
