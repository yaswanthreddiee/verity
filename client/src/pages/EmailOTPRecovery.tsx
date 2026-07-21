import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EmailOTPRecovery() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/recover-account");
      return;
    }

    sendOTP();
  }, []);

  const sendOTP = async () => {
    try {
      setSending(true);

      await api.post("/otp/send", {
        email,
      });

      alert("OTP sent successfully.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    try {
      if (!otp) {
        alert("Enter OTP");
        return;
      }
  
      setLoading(true);
  
      const res = await api.post("/otp/verify", {
        email,
        otp,
      });
  
      navigate("/reset-password", {
        state: {
          email,
          resetToken: res.data.resetToken,
        },
      });
  
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP");
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
        background: "#f4f6fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          Email Verification
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Enter the OTP sent to
          <br />
          <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={verifyOTP}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={sendOTP}
          disabled={sending}
          style={{
            width: "100%",
            padding: "12px",
            background: "#e5e7eb",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {sending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}