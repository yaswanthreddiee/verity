import { useEffect, useState } from "react";
import api from "../services/api";

interface Request {
  _id: string;
  challengeId: string;
  deviceId: string;
  status: string;
  createdAt?: string;
}

export default function PendingRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const res = await api.get("/qr/pending");

      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (challengeId: string) => {
    try {
      await api.post("/qr/approve", {
        challengeId,
      });

      alert("✅ Login Approved");

      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Approval Failed");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
      }}
    >
      <h1>🔔 Pending Login Requests</h1>

      {requests.length === 0 ? (
        <div
          style={{
            background: "#f4f4f4",
            padding: 20,
            borderRadius: 10,
          }}
        >
          ✅ No Pending Requests
        </div>
      ) : (
        requests.map((request) => (
          <div
            key={request._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h3>🔐 New Login Request</h3>

            <p>
              <b>Device ID</b>
              <br />
              {request.deviceId}
            </p>

            <p>
              <b>Status</b>
              <br />
              🟠 {request.status}
            </p>

            <button
              onClick={() => approve(request.challengeId)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                background: "#2563eb",
                color: "white",
              }}
            >
              Approve Login
            </button>
          </div>
        ))
      )}
    </div>
  );
}