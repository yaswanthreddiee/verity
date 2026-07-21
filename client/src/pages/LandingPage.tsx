import { Link } from "react-router-dom";
import "./Landing.css";

export default function LandingPage() {
  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">🛡 VERITY</h2>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register" className="register-btn">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">

        <div className="hero-left">

          <h1>
            Trust Every Login.
            <br />
            Verify Every Device.
          </h1>

          <p>
            Verity protects your account using
            <strong> Trusted Devices</strong>,
            <strong> QR Authentication</strong>,
            <strong> Email OTP</strong>,
            and
            <strong> Secure Recovery.</strong>
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started
            </Link>

            <Link to="/" className="secondary-btn">
              Login
            </Link>
          </div>

        </div>

        <div className="hero-right">
          <div className="shield">
            🛡
          </div>
        </div>

      </section>

      {/* Features */}

      <section className="features">

        <div className="card">
          <h3>🛡 Trusted Devices</h3>
          <p>Approve logins only from your trusted devices.</p>
        </div>

        <div className="card">
          <h3>📱 QR Authentication</h3>
          <p>Secure QR approval for new device logins.</p>
        </div>

        <div className="card">
          <h3>🔑 Password Recovery</h3>
          <p>Recover accounts with Trusted Devices or Email OTP.</p>
        </div>

        <div className="card">
          <h3>📊 Audit Logs</h3>
          <p>Track every login and security activity.</p>
        </div>

      </section>

      {/* CTA */}

      <section className="cta">

        <h2>Ready to secure your identity?</h2>

        <Link to="/register" className="primary-btn">
          Create Account
        </Link>

      </section>

    </div>
  );
}