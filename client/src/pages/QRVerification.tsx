import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import api from "../services/api";

export default function QRVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const challengeId = location.state?.challengeId;

  const [status, setStatus] = useState("⏳ Waiting for approval...");
  const [timeLeft, setTimeLeft] = useState(120);

  // Poll for approval
  useEffect(() => {
    if (!challengeId) {
      alert("Invalid QR Challenge");
      navigate("/");
      return;
    }

    const interval = setInterval(async () => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

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
  }, [challengeId, navigate, timeLeft]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setStatus("❌ QR Code Expired");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

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
          width: "100%",
          maxWidth: "520px",
          background: "#fff",
          borderRadius: "16px",
          padding: "35px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "42px" }}>🔐</span>

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              lineHeight: 1.2,
            }}
          >
            Verify New Device
          </h1>
        </div>

        <p
          style={{
            color: "#555",
            marginBottom: "25px",
            fontSize: "18px",
          }}
        >
          Scan this QR code using one of your trusted devices to approve this
          login.
        </p>

        {/* QR */}

        {timeLeft > 0 ? (
          <QRCode value={approvalUrl} size={250} />
        ) : (
          <div
            style={{
              padding: "50px",
              border: "2px dashed #dc2626",
              borderRadius: "12px",
              color: "#dc2626",
              fontWeight: "bold",
              fontSize: "22px",
            }}
          >
            ❌ QR Code Expired
          </div>
        )}

        <p
          style={{
            marginTop: "20px",
            color: "#666",
            fontSize: "15px",
          }}
        >
          🔒 QR Code expires in <strong>{formattedTime}</strong>
        </p>

        <hr style={{ margin: "30px 0" }} />

        {/* Alternatives */}

        <h2 style={{ color: "#374151" }}>
          Need another way to verify?
        </h2>

        <p
          style={{
            color: "#666",
            lineHeight: 1.6,
          }}
        >
          If you cannot scan this QR code, you can recover your account using
          your Recovery Circle or cancel this login attempt.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <Link to="/recovery">
            <button
              style={{
                width: "100%",
                padding: "14px",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Recover Using Recovery Circle
            </button>
          </Link>

          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              padding: "14px",
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
              Cancel Login
          </button>
        </div>

        {/* Status */}

        <div
          style={{
            marginTop: "35px",
            padding: "20px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "12px",
            color: "#1d4ed8",
            fontWeight: 600,
            lineHeight: 1.6,
          }}
        >
          {status}

          <br />

          <small
            style={{
              color: "#555",
            }}
          >
            Waiting for approval from one of your trusted devices.
          </small>
        </div>
      </div>
    </div>
  );
}