import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaLaptopMedical,
  FaUserShield,
  FaTools,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";

import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";

import "../assets/css/pages/home.css";

export default function Home() {
  let auth = null;

  try {
    auth = JSON.parse(localStorage.getItem("auth"));
  } catch {
    auth = null;
  }

  const dashboardRoute = () => {
    if (!auth) return "/";

    switch (auth.role) {
      case "ADMIN":
        return "/admin/dashboard";

      case "TECHNICIAN":
        return "/technician/dashboard";

      default:
        return "/user/dashboard";
    }
  };

  return (
    <>
      <PublicNavbar />

      {/* ================= Hero ================= */}

      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">

            <div className="col-lg-6">

              <span className="hero-badge">
                Computer Service Management System
              </span>

              <h1 className="hero-title">
                Manage Computer Repair Services
                <span> Faster, Smarter & Easier</span>
              </h1>

              <p className="hero-description">
                {auth ? (
                  <>
                    Welcome back <strong>{auth.name}</strong> 👋
                    <br />
                    <br />
                    Continue managing your computer service requests quickly and efficiently.
                  </>
                ) : (
                  <>
                    A modern platform for managing computer repair requests,
                    technician assignments, repair tracking, and customer updates—
                    all in one place.
                  </>
                )}
              </p>

              <div className="hero-buttons">

                {!auth ? (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary-custom"
                    >
                      Get Started
                      <FaArrowRight />
                    </Link>

                    <Link
                      to="/login"
                      className="btn-secondary-custom"
                    >
                      User Login
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={dashboardRoute()}
                      className="btn-primary-custom"
                    >
                      Go to Dashboard
                      <FaArrowRight />
                    </Link>

                    {auth.role === "USER" && (
                      <Link
                        to="/user/request"
                        className="btn-secondary-custom"
                      >
                        Create Request
                      </Link>
                    )}
                  </>
                )}

              </div>

            </div>

            <div className="col-lg-6">

              <div className="hero-card">

                <div className="hero-status">

                  <span className="status-dot"></span>

                  System Online

                </div>

                <FaLaptopMedical className="hero-icon" />

                <h3>Professional Repair Management</h3>

                <p>
                  Manage computer service requests with a secure,
                  fast and user-friendly platform.
                </p>

                <div className="hero-stats">

                  <div>

                    <h4>1200+</h4>

                    <span>Repairs</span>

                  </div>

                  <div>

                    <h4>98%</h4>

                    <span>Success</span>

                  </div>

                  <div>

                    <h4>24/7</h4>

                    <span>Support</span>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= Features ================= */}

      <section
        className="features-section"
        id="features"
      >

        <div className="container">

          <div className="section-title">

            <span className="section-badge">
              FEATURES
            </span>

            <h2>Why Choose CSMS?</h2>

            <p>
              Powerful features designed to simplify computer service
              management for customers, administrators and technicians.
            </p>

          </div>

          <div className="row g-4">

            <div className="col-md-6 col-lg-3">

              <div className="feature-card">

                <div className="feature-icon blue">
                  <FaLaptopMedical />
                </div>

                <h4>Easy Request</h4>

                <p>
                  Submit repair requests in less than a minute with complete
                  device information.
                </p>

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div className="feature-card">

                <div className="feature-icon purple">
                  <FaUserShield />
                </div>

                <h4>Admin Management</h4>

                <p>
                  Review requests, assign technicians and monitor every repair
                  process.
                </p>

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div className="feature-card">

                <div className="feature-icon green">
                  <FaTools />
                </div>

                <h4>Expert Technicians</h4>

                <p>
                  Skilled professionals diagnose and repair systems with
                  real-time updates.
                </p>

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div className="feature-card">

                <div className="feature-icon orange">
                  <FaChartLine />
                </div>

                <h4>Live Tracking</h4>

                <p>
                  Track every repair from submission to completion without
                  calling the service center.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= Workflow ================= */}

      <section
        className="workflow-section"
        id="workflow"
      >

        <div className="container">

          <div className="section-title">

            <span className="section-badge">
              PROCESS
            </span>

            <h2>How CSMS Works</h2>

            <p>
              A simple four-step workflow that ensures every repair request is
              handled efficiently from submission to completion.
            </p>

          </div>

          <div className="workflow-container">

            <div className="workflow-card">

              <div className="workflow-number">01</div>

              <div className="workflow-icon blue">
                <FaClipboardList />
              </div>

              <h4>Create Request</h4>

              <p>
                Submit your computer issue with complete device details and problem description.
              </p>

            </div>

            <div className="workflow-card">

              <div className="workflow-number">02</div>

              <div className="workflow-icon purple">
                <FaUserShield />
              </div>

              <h4>Admin Review</h4>

              <p>
                The administrator reviews your request and assigns the best technician.
              </p>

            </div>

            <div className="workflow-card">

              <div className="workflow-number">03</div>

              <div className="workflow-icon green">
                <FaTools />
              </div>

              <h4>Repair Process</h4>

              <p>
                The technician diagnoses, repairs, and updates the service status.
              </p>

            </div>

            <div className="workflow-card">

              <div className="workflow-number">04</div>

              <div className="workflow-icon orange">
                <FaCheckCircle />
              </div>

              <h4>Completed</h4>

              <p>
                Track your request in real time until the repair is completed successfully.
              </p>

            </div>

          </div>

        </div>

      </section>
      {/* ================= Statistics ================= */}

      <section className="stats-section">

        <div className="container">

          <div className="section-title">

            <span className="section-badge">
              ACHIEVEMENTS
            </span>

            <h2>Trusted by Hundreds of Customers</h2>

            <p>
              Our platform simplifies computer service management with fast,
              transparent and reliable repair tracking.
            </p>

          </div>

          <div className="row g-4">

            <div className="col-md-6 col-lg-3">

              <div className="stat-card">

                <FaLaptopMedical className="stat-icon" />

                <h2>850+</h2>
                <span>Happy Customers</span>

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div className="stat-card">

                <FaUsers className="stat-icon" />

                <h2>850+</h2>
                <span>Happy Customers</span>

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div className="stat-card">

                <FaTools className="stat-icon" />

                <h2>35+</h2>
                <span>Expert Technicians</span>

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <div className="stat-card">

                <FaCheckCircle className="stat-icon" />

                <h2>98%</h2>
                <span>Success Rate</span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      {!auth && (
        <section
          className="cta-section"
          id="contact"
        >
          <div className="container text-center">

            <FaUsers className="cta-icon" />

            <h2>Need Your Computer Repaired?</h2>

            <p>
              Join CSMS today and experience a faster,
              transparent and hassle-free repair management system.
            </p>

            <Link
              to="/register"
              className="btn-primary-custom"
            >
              Create Your Account
            </Link>

          </div>
        </section>
      )}

      <Footer />
    </>
  );
}