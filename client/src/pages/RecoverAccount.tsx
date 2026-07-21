import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RecoverAccount() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const continueRecovery = async () => {
    try {
      if (!email) {
        alert("Please enter your email");
        return;
      }

      setLoading(true);

      const res = await api.post("/auth/check-recovery", {
        email,
      });

      switch (res.data.recoveryType) {
        case "TRUSTED_DEVICE": {
          const challenge = await api.post(
            "/recovery/password/request",
            {
              email,
            }
          );

          navigate("/forgot-password/trusted-device", {
            state: {
              email,
              challengeId: challenge.data.challengeId,
            },
          });

          break;
        }

        case "EMAIL_OTP":
          navigate("/forgot-password/otp", {
            state: {
              email,
            },
          });
          break;

        default:
          alert("Recovery method unavailable.");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#fff",
          padding: "35px",
          borderRadius: "14px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          🔒 Recover Password
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Enter your registered email to continue.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={continueRecovery}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </div>
    </div>
  );
}