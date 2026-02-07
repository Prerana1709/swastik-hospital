// FeatureCard.jsx


function FeatureCard({ icon, title }) {
  return (
    <div className="feature-card">
      <div className="card-icon">
        <img src={icon} alt={title} />
      </div>
      <h3 className="card-title">{title}</h3>
    </div>
  );
}

export default FeatureCard;