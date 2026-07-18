import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

interface User {
  fullName: string;
  email: string;
  createdAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h1>🛡️ Verity Security Dashboard</h1>

        <p style={{ color: "#666" }}>
          Welcome back. Your identity is protected by Verity.
        </p>

        <br />

        {/* Profile */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
            marginBottom: "35px",
          }}
        >
          <h2>👤 My Account</h2>

          <p>
            <strong>Name:</strong>{" "}
            {user ? user.fullName : "Loading..."}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user ? user.email : "Loading..."}
          </p>

          <p>
            <strong>Member Since:</strong>{" "}
            {user
              ? new Date(user.createdAt).toLocaleDateString()
              : "Loading..."}
          </p>
        </div>

        {/* Security Overview */}

        <h2>Security Overview</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "20px",
            marginTop: "20px",
            marginBottom: "40px",
          }}
        >
          <div style={cardStyle}>
            <h1>💻</h1>
            <h3>Trusted Devices</h3>
            <p>Manage approved devices</p>
          </div>

          <div style={cardStyle}>
            <h1>🔔</h1>
            <h3>Pending Requests</h3>
            <p>Approve new device logins</p>
          </div>

          <div style={cardStyle}>
            <h1>👥</h1>
            <h3>Recovery Circle</h3>
            <p>Trusted people for recovery</p>
          </div>

          <div style={cardStyle}>
            <h1>📜</h1>
            <h3>Audit Logs</h3>
            <p>Coming Soon</p>
          </div>
        </div>

        {/* Quick Actions */}

        <h2>Quick Actions</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <Link to="/devices">
            <button style={buttonStyle}>Trusted Devices</button>
          </Link>

          <Link to="/pending">
            <button style={buttonStyle}>Pending Requests</button>
          </Link>

          <Link to="/trust-circle">
            <button style={buttonStyle}>Recovery Circle</button>
          </Link>

          <Link to="/recovery-requests">
            <button style={buttonStyle}>Recovery Requests</button>
          </Link>
          <Link to="/settings">
  <button style={buttonStyle}>
    Account Settings
  </button>
</Link>
          <button
            disabled
            style={{
              ...buttonStyle,
              background: "#999",
              cursor: "not-allowed",
            }}
          >
            Audit Logs (Coming Soon)
          </button>
        </div>

        <button
          onClick={logout}
          style={{
            marginTop: "50px",
            padding: "12px 25px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};