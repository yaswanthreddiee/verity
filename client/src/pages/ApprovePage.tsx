import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

export default function ApprovePage() {
  const { challengeId } = useParams();

  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  const approve = async () => {
    try {
      setLoading(true);

      await api.post("/qr/approve", {
        challengeId,
      });

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
          <p>A new device is requesting access.</p>

          <button
            onClick={approve}
            disabled={loading}
          >
            {loading ? "Approving..." : "Approve Device"}
          </button>
        </>
      ) : (
        <>
          <h2>✅ Device Approved</h2>
          <p>You can now return to your laptop.</p>
        </>
      )}
    </div>
  );
}