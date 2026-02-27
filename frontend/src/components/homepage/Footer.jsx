import { Link } from "react-router-dom";
import "./Footer.css";

function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer__inner">
        <div className="home-footer__top">
          <div className="home-footer__links">
            <Link to="/about">About</Link>
            <Link to="/#services">Services</Link>
            <Link to="/doctors">Doctors</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="home-footer__contact">
            <a href="tel:+911234567890">+91 123 456 7890</a>
            <a href="mailto:info@swastikhospital.com">info@swastikhospital.com</a>
          </div>
          <div className="home-footer__social">
            <a href="#" className="home-footer__social-link" aria-label="Facebook">FB</a>
            <a href="#" className="home-footer__social-link" aria-label="Twitter">TW</a>
            <a href="#" className="home-footer__social-link" aria-label="LinkedIn">IN</a>
          </div>
        </div>
        <div className="home-footer__bottom">
          <p className="home-footer__copy">
            © {new Date().getFullYear()} Swastik Hospital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
