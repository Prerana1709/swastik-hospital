import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/swastiklogo.png";
import {
  Hero,
  Stats,
  About,
  Services,
  Doctors,
  ContactCTA,
  HomeFooter
} from "../components/homepage";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    <div className="home-page">
      <nav className="home-nav">
        <div className="home-nav__inner">
          <Link to="/" className="home-nav__logo" aria-label="Swastik Hospital Home">
            <img src={logo} alt="" className="home-nav__logo-img" />
            <span className="home-nav__logo-text">Swastik Hospital</span>
          </Link>
          <ul className="home-nav__links">
            <li>
              <button type="button" onClick={() => scrollToSection("hero")}>
                Home
              </button>
            </li>
            <li>
              <button type="button" onClick={() => scrollToSection("services")}>
                Services
              </button>
            </li>
            <li>
              <button type="button" onClick={() => scrollToSection("about")}>
                About
              </button>
            </li>
            <li>
              <button type="button" onClick={() => scrollToSection("doctors")}>
                Doctors
              </button>
            </li>
            <li>
              <button type="button" onClick={() => scrollToSection("contact")}>
                Contact
              </button>
            </li>
            <li>
              <Link to="/patient-portal" className="home-nav__link-portal">
                Patient Portal
              </Link>
            </li>
            <li>
              <Link to="/login" className="home-nav__btn-login">
                Login
              </Link>
            </li>

          </ul>
        </div>
      </nav>

      <main>
        <Hero />
        <Stats />
        <About />
        <Services />
        <Doctors />
        <ContactCTA />
      </main>

      <HomeFooter />
    </div>
  );
}

export default Home;
