import React from "react";
import Navbar from "../components/navbar/Navbar";
import {
  HeroCarousel,
  Stats,
  About,
  Services,
  Doctors,
  HomeFooter
} from "../components/homepage";
import "./PatientHome.css";

function PatientHome() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="patient-home">
      <Navbar scrollToSection={scrollToSection} />

      <main>
        <HeroCarousel />
        <Stats />
        <Services />
        <About />
        <Doctors />
      </main>

      <HomeFooter />
    </div>
  );
}

export default PatientHome;
