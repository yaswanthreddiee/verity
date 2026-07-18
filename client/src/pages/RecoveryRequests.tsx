import { useEffect, useState } from "react";
import api from "../services/api";

export default function RecoveryRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const res = await api.get("/recovery/pending");
    setRequests(res.data.requests || []);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approve = async (requestId: string) => {
    await api.post("/recovery/approve", {
      requestId,
    });

    alert("Recovery Approved");

    loadRequests();
  };

  const reject = async (requestId: string) => {
    await api.post("/recovery/reject", {
      requestId,
    });

    alert("Recovery Rejected");

    loadRequests();
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
      }}
    >
      <h1>Recovery Requests</h1>

      {requests.length === 0 ? (
        <p>No recovery requests.</p>
      ) : (
        requests.map((r: any) => (
          <div
            key={r._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <h3>{r.userId.fullName}</h3>

            <p>{r.userId.email}</p>

            <p>{r.deviceName}</p>

            <button onClick={() => approve(r._id)}>
              Approve
            </button>

            <button
              onClick={() => reject(r._id)}
              style={{
                marginLeft: 10,
              }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}