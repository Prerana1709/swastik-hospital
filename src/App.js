import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header/Header";
import FeatureCard from "./components/Card/FeatureCard";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Registration from "./pages/Registration";
import Clinical from "./pages/Clinical";

import clinical from "./assets/clinical.png";
import billing from "./assets/bills.png";
import analytics from "./assets/analytics.png";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LANDING PAGE */}
        <Route
          path="/"
          element={
            <>
              <Header />

              <main className="main">
                <h1>
                  WELCOME TO <br /> SWASTIK EMR FOR CLINICS
                </h1>

                <p className="subtitle">GET STARTED</p>

                <div className="card-container">
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "inherit" }}
                    aria-label="Open login"
                  >
                    <FeatureCard icon={clinical} title="CLINICAL SERVICE" />
                  </Link>
                  <FeatureCard
                    icon={billing}
                    title="PAYMENT & BILLING"
                  />
                  <FeatureCard
                    icon={analytics}
                    title="ANALYTICS"
                  />
                </div>
              </main>

              <Footer />
            </>
          }
        />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD PAGE */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* REGISTRATION PAGE */}
        <Route path="/registration" element={<Registration />} />

        {/* CLINICAL PAGE */}
        <Route path="/clinical" element={<Clinical />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
