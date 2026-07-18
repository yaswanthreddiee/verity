import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import api from "../services/api";

export default function QRVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const challengeId = location.state?.challengeId;

  const [status, setStatus] = useState("⏳ Waiting for approval...");

  useEffect(() => {
    if (!challengeId) {
      alert("Invalid QR Challenge");
      navigate("/");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/qr/status/${challengeId}`);

        if (res.data.status === "APPROVED") {
          clearInterval(interval);

          setStatus("✅ Device Approved!");

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [challengeId, navigate]);

  const approvalUrl = `${import.meta.env.VITE_APP_URL}/approve/${challengeId}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6fb",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "#fff",
          borderRadius: "16px",
          padding: "35px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>🔐 Verify New Device</h1>

        <p style={{ color: "#555", marginBottom: "25px" }}>
          Scan this QR code using one of your trusted devices to approve this
          login.
        </p>

        <QRCode value={approvalUrl} size={220} />

        <hr style={{ margin: "30px 0" }} />

        <h3>Alternative Options</h3>

        <p style={{ color: "#666" }}>
          If you cannot scan the QR code, you can:
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <Link to="/pending">
            <button
              style={{
                width: "100%",
                padding: "12px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Open Pending Requests
            </button>
          </Link>

          <Link to="/recovery">
            <button
              style={{
                width: "100%",
                padding: "12px",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Recover Using Recovery Circle
            </button>
          </Link>
        </div>

        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            background: "#eef6ff",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          {status}
        </div>
      </div>
    </div>
  );
}