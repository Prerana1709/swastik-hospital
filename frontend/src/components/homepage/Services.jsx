import "./Services.css";

const SERVICES = [
  { id: 1, title: "Cardiology", icon: "❤️" },
  { id: 2, title: "Pediatrics", icon: "👶" },
  { id: 3, title: "Orthopedics", icon: "🦴" },
  { id: 4, title: "Diagnostics", icon: "🔬" },
  { id: 5, title: "Emergency Care", icon: "🚑" },
];

function Services() {
  return (
    <section className="home-services" id="services" aria-labelledby="services-title">
      <div className="home-services__inner">
        <h2 id="services-title" className="home-services__title">Our Services & Departments</h2>
        <p className="home-services__intro">
          Comprehensive care across key specialties to meet your healthcare needs.
        </p>
        <div className="home-services__grid">
          {SERVICES.map((service) => (
            <div key={service.id} className="home-services__card">
              <span className="home-services__icon" aria-hidden="true">
                {service.icon}
              </span>
              <h3 className="home-services__card-title">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
