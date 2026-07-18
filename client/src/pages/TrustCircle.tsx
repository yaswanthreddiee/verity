import { useEffect, useState } from "react";
import api from "../services/api";

interface Member {
  _id: string;
  trustedName: string;
  trustedEmail: string;
}

export default function TrustCircle() {
  const [trustedName, setTrustedName] = useState("");
  const [trustedEmail, setTrustedEmail] = useState("");
  const [members, setMembers] = useState<Member[]>([]);

  const loadMembers = async () => {
    try {
        const res = await api.get("/trust/list");

        setMembers(res.data.members || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const addMember = async () => {
    if (!trustedName || !trustedEmail) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/trust/add", {
        trustedName,
        trustedEmail,
      });

      setTrustedName("");
      setTrustedEmail("");

      alert("Trust Circle Updated");

      loadMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Trust Circle</h1>

      <input
        type="text"
        placeholder="Trusted Person Name"
        value={trustedName}
        onChange={(e) => setTrustedName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="Trusted Person Email"
        value={trustedEmail}
        onChange={(e) => setTrustedEmail(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addMember}>
        Add Member
      </button>

      <hr />

      <h2>Trusted Members</h2>

      {members.length === 0 ? (
        <p>No members added.</p>
      ) : 
        members.map((member) => (
          <div
            key={member._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{member.trustedName}</h3>
            <p>{member.trustedEmail}</p>
          </div>
        ))}
    </div>
  );
}