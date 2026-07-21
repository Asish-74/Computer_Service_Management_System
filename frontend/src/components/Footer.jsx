import {
  FaLaptopMedical,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaArrowUp,
} from "react-icons/fa";

import "../assets/css/components/footer.css";

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      <div className="container">

        <div className="row gy-5">

          {/* Company */}

          <div className="col-lg-4">

            <div className="footer-brand">

              <div className="footer-logo">

                <FaLaptopMedical />

              </div>

              <h3>CSMS</h3>

            </div>

            <p>
              Computer Service Management System helps customers,
              technicians and administrators manage repair services
              efficiently through a modern web platform.
            </p>

          </div>

          {/* Quick Links */}

          <div className="col-lg-2">

            <h5>Quick Links</h5>

            <ul>

              <li><a href="/">Home</a></li>

              <li><a href="#features">Features</a></li>

              <li><a href="#workflow">Workflow</a></li>

              <li><a href="#contact">Contact</a></li>

            </ul>

          </div>

          {/* Services */}

          <div className="col-lg-3">

            <h5>Services</h5>

            <ul>

              <li>Computer Repair</li>

              <li>Laptop Repair</li>

              <li>Hardware Upgrade</li>

              <li>Software Installation</li>

            </ul>

          </div>

          {/* Contact */}

          <div className="col-lg-3">

            <h5>Contact</h5>

            <p>

              <FaPhoneAlt />

              +91 63726 69397

            </p>

            <p>
              <FaEnvelope />
              asishkhuntia07@gmail.com
            </p>

            <p>
              <FaMapMarkerAlt />
              Bengaluru, India
            </p>

            <div className="footer-social">
              <a href="https://github.com/Asish-74">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/asish-khuntia-software-engg/">
                <FaLinkedin />
              </a>
            </div>

          </div>

        </div>

        <hr />

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Computer Service Management System.
            All Rights Reserved.
          </p>

          <button
            onClick={scrollTop}
            className="top-btn"
          >
            <FaArrowUp />
          </button>

        </div>

      </div>
    </footer>
  );
}