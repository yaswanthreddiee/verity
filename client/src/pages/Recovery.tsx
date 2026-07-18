import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getDeviceInfo } from "../utils/deviceInfo";

export default function Recovery() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);

  const requestRecovery = async () => {
    try {
      setLoading(true);

      const device = getDeviceInfo();

      const res = await api.post("/recovery/request", {
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        browser: device.browser,
        os: device.os,
      });

      setSessionId(res.data.recoverySessionId);

      setMessage(
        "🔐 Recovery request sent.\n\nWaiting for one of your guardians to approve this device..."
      );
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || "Recovery request failed."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/recovery/status/${sessionId}`);

        if (res.data.status === "APPROVED") {
          clearInterval(interval);

          setMessage("✅ Recovery Approved!\nRedirecting...");

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        }

        if (res.data.status === "REJECTED") {
          clearInterval(interval);

          setMessage(
            "❌ Your recovery request was rejected by your guardian."
          );
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111827",
        color: "white",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "#1f2937",
          padding: "35px",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        }}
      >
        <h1>Account Recovery</h1>

        <p>You don't have any trusted devices.</p>

        <p>
          Send a recovery request to your Recovery Circle.
        </p>

        <button
          onClick={requestRecovery}
          disabled={loading || sessionId !== ""}
          style={{
            marginTop: "15px",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "#22c55e",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {loading ? "Sending..." : "Request Recovery"}
        </button>

        {message && (
          <div
            style={{
              marginTop: "25px",
              background: "#374151",
              padding: "15px",
              borderRadius: "10px",
              whiteSpace: "pre-line",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}