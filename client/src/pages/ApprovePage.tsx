import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useLocation } from "react-router-dom";
export default function ApprovePage() {
  const { challengeId } = useParams();

  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const location = useLocation();

  const isPasswordRecovery =
    location.pathname.startsWith("/approve/password");
  const approve = async () => {
    try {
      setLoading(true);

      await api.post(
        isPasswordRecovery
          ? "/recovery/password/approve"
          : "/qr/approve",
        {
          challengeId,
        }
      );

      setApproved(true);
    } catch (err) {
      console.error(err);
      alert("Approval Failed");
    } finally {
      setLoading(false);
    }
  };

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
      <h1>Verity Approval</h1>

      {!approved ? (
        <>
          <p>
  {isPasswordRecovery
    ? "Approve this password recovery request."
    : "A new device is requesting access."}
</p>

          <button
            onClick={approve}
            disabled={loading}
          >
{loading
  ? "Approving..."
  : isPasswordRecovery
  ? "Approve Password Recovery"
  : "Approve Device"}          </button>
        </>
      ) : (
        <>
         <>
  <h2>
    {isPasswordRecovery
      ? "✅ Password Recovery Approved"
      : "✅ Device Approved"}
  </h2>

  <p>
    {isPasswordRecovery
      ? "You can now return to your browser and reset your password."
      : "You can now return to your laptop."}
  </p>
</>
        </>
      )}
    </div>
  );
}