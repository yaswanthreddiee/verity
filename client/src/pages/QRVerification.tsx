import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import api from "../services/api";

export default function QRVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const challengeId = location.state?.challengeId;

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

          alert("Device Approved!");

          navigate("/dashboard");
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [challengeId, navigate]);

  const approvalUrl =
  `${import.meta.env.VITE_APP_URL}/approve/${challengeId}`;
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1>Scan to Approve Login</h1>

      {challengeId ? (
        <>
          <QRCode value={approvalUrl} size={250} />

          <p>Waiting for approval...</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}