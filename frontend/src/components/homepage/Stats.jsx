import "./Stats.css";

const STATS = [
  { value: "50K+", label: "Patients Treated" },
  { value: "4.8★", label: "Overall Rating" },
  { value: "NABH", label: "Accredited" },
];

function Stats() {
  return (
    <section className="home-stats">
      <div className="home-stats__inner">
        {STATS.map((stat, index) => (
          <div key={index} className="home-stats__card">
            <span className="home-stats__value">{stat.value}</span>
            <span className="home-stats__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
