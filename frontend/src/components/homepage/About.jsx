import "./About.css";

function About() {
  return (
    <section className="home-about" id="about">
      <div className="home-about__inner">
        <h2 className="home-about__title">About Swastik Hospital</h2>
        <div className="home-about__content">
          <p className="home-about__lead">
            Redefining patient-centred care with excellence and empathy.
          </p>
          <p className="home-about__text">
            Swastik Hospital is committed to providing comprehensive healthcare services
            with a focus on quality, accessibility, and compassion. Our mission is to
            deliver evidence-based medical care across multiple specialties while
            ensuring every patient feels heard, supported, and cared for.
          </p>
          <p className="home-about__text">
            We believe in a holistic approach to health—combining advanced diagnostics,
            experienced specialists, and a caring environment to support your journey to
            wellness. From routine check-ups to specialised treatment, we are here for
            you and your family at every step.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
