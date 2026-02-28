// Patient Home Page – public landing for Swastik Psychiatric Hospital.
// "Hospital Login" goes to /login; "Access Patient Portal" goes to /patient-portal.
import { useNavigate, Link } from "react-router-dom";
import "./PatientHome.css";
import logo from "../assets/swastiklogo.png";
import Doctors from "../components/homepage/Doctors";

const SERVICES = [
  { id: 1, title: "Depression Treatment", description: "Evidence-based care for mood disorders." },
  { id: 2, title: "Anxiety Disorders", description: "Personalized support for anxiety and related conditions." },
  { id: 3, title: "Bipolar Disorder", description: "Comprehensive management and stabilization." },
  { id: 4, title: "Addiction Therapy", description: "Structured programs for substance use recovery." },
  { id: 5, title: "Family Counseling", description: "Therapy for families and relationships." },
];

function PatientHome() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="patient-home">
      {/* Navbar */}
      <nav className="patient-home-nav">
        <div className="patient-home-nav-inner">
          <Link to="/" className="patient-home-logo" aria-label="Swastik Hospital Home">
            <img src={logo} alt="Swastik Hospital" />
            <span>Swastik Hospital</span>
          </Link>
          <ul className="patient-home-nav-links">
            <li><button type="button" onClick={() => scrollToSection("hero")}>Home</button></li>
            <li><button type="button" onClick={() => scrollToSection("services")}>Services</button></li>
            <li><button type="button" onClick={() => scrollToSection("about")}>About</button></li>
            <li><button type="button" onClick={() => scrollToSection("contact")}>Contact</button></li>
            <li>
              <button
                type="button"
                className="patient-home-btn-login"
                onClick={() => navigate("/login")}
              >
                Hospital Login
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="patient-home-hero">
        <div className="patient-home-hero-content">
          <h1>Welcome to Swastik Psychiatric Hospital</h1>
          <p className="patient-home-hero-subtitle">
            Healing Minds with Compassion & Confidential Care
          </p>
          <div className="patient-home-hero-btns">
            <button
              type="button"
              className="patient-home-btn patient-home-btn-primary"
              onClick={() => navigate("/patient-portal/appointments")}
            >
              Book Appointment
            </button>

            <button
              type="button"
              className="patient-home-btn patient-home-btn-secondary"
              onClick={() => navigate("/patient-portal")}
            >
              Access Patient Portal
            </button>

          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="patient-home-section patient-home-services">
        <div className="patient-home-container">
          <h2>Our Services</h2>
          <p className="patient-home-section-intro">
            Comprehensive mental health care tailored to your needs.
          </p>
          <div className="patient-home-cards">
            {SERVICES.map((s) => (
              <div key={s.id} className="patient-home-card">
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Doctors */}
      <Doctors />

      {/* About */}
      <section id="about" className="patient-home-section patient-home-about">
        <div className="patient-home-container">
          <h2>About Us</h2>
          <div className="patient-home-about-grid">
            <div className="patient-home-about-item">
              <span className="patient-home-about-icon">👨‍⚕️</span>
              <h3>Experienced Psychiatrists</h3>
              <p>Our team includes specialists trained in modern psychiatric care.</p>
            </div>
            <div className="patient-home-about-item">
              <span className="patient-home-about-icon">🔒</span>
              <h3>Confidential Treatment</h3>
              <p>Your privacy and dignity are at the heart of everything we do.</p>
            </div>
            <div className="patient-home-about-item">
              <span className="patient-home-about-icon">🆘</span>
              <h3>24/7 Emergency Support</h3>
              <p>Round-the-clock care when you need it most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact placeholder */}
      <section id="contact" className="patient-home-section patient-home-contact">
        <div className="patient-home-container">
          <h2>Contact</h2>
          <p className="patient-home-contact-text">
            Reach out for appointments or inquiries. We are here to help.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="patient-home-cta">
        <div className="patient-home-container">
          <button
            type="button"
            className="patient-home-cta-btn"
            onClick={() => window.open("/dashboard", "_blank")}
          >
            Access Clinical Portal
          </button>
        </div>
      </section>


      {/* Footer */}
      <footer className="patient-home-footer">
        <div className="patient-home-footer-content">
          <p className="patient-home-footer-copyright">
            © {new Date().getFullYear()} Swastik Hospital. All rights reserved. | Developed and managed by ORELSE Private Limited.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PatientHome;
