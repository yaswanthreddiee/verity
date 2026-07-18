import { useEffect, useState } from "react";
import api from "../services/api";

interface Request {
  _id: string;
  challengeId: string;
  deviceId: string;
  status: string;
}

export default function PendingRequests() {
  const [requests, setRequests] = useState<Request[]>([]);

  const loadRequests = async () => {
    try {
      const res = await api.get("/qr/pending");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approve = async (challengeId: string) => {
    try {
      await api.post("/qr/approve", {
        challengeId,
      });

      alert("Request Approved");

      loadRequests();
    } catch (err) {
      console.error(err);
      alert("Approval Failed");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Pending Login Requests</h1>

      {requests.length === 0 ? (
        <p>No Pending Requests</p>
      ) : (
        requests.map((request) => (
          <div
            key={request._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >
            <p>
              <strong>Challenge:</strong> {request.challengeId}
            </p>

            <p>
              <strong>Device:</strong> {request.deviceId}
            </p>

            <button
              onClick={() => approve(request.challengeId)}
            >
              Approve
            </button>
          </div>
        ))
      )}
    </div>
  );
}