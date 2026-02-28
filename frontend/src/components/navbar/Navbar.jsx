import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/swastiklogo.png";

const Navbar = ({ scrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (scrollToSection) {
      scrollToSection(sectionId);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="Swastik Hospital" />
          <span>Swastik Hospital</span>
        </Link>

        <div className={`navbar__links ${isMobileMenuOpen ? "navbar__links--open" : ""}`}>
          <button onClick={() => handleNavClick("hero")} className="navbar__link">Home</button>
          <button onClick={() => handleNavClick("services")} className="navbar__link">Services</button>
          <button onClick={() => handleNavClick("about")} className="navbar__link">About</button>
          <button onClick={() => handleNavClick("doctors")} className="navbar__link">Doctors</button>
          <button onClick={() => handleNavClick("contact")} className="navbar__link">Contact</button>

          <div className="navbar__actions">
            <button
              className="navbar__btn navbar__btn--outline"
              onClick={() => window.open("/login", "_blank")}
            >
              Hospital Login
            </button>
            <button
              className="navbar__btn navbar__btn--primary"
              onClick={() => navigate("/patient-portal")}
            >
              Patient Portal
            </button>
          </div>
        </div>

        <button className="navbar__mobile-toggle" onClick={toggleMobileMenu}>
          <span className={`navbar__hamburger ${isMobileMenuOpen ? "navbar__hamburger--open" : ""}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
