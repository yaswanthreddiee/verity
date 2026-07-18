import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface User {
  fullName: string;
  email: string;
  createdAt: string;
}

export default function AccountSettings() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [deletePassword, setDeletePassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  const changePassword = async () => {
    try {
      if (!currentPassword || !newPassword) {
        alert("Please fill all fields");
        return;
      }

      setLoading(true);

      const res = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      alert(res.data.message);
      setOtpSent(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    try {
      if (!user) return;
  
      if (!deletePassword) {
        alert("Please enter your password first.");
        return;
      }
  
      setLoading(true);
  
      // Step 1: Verify Password
      await api.post("/auth/verify-password", {
        password: deletePassword,
      });
  
      // Step 2: Send OTP
      const res = await api.post("/otp/send", {
        email: user.email,
      });
  
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <h1>⚙️ Account Settings</h1>

        <p style={{ color: "#666" }}>
          Manage your Verity account securely.
        </p>

        <br />

        {/* Profile */}

        <div style={cardStyle}>
          <h2>👤 My Profile</h2>

          <p>
            <strong>Name:</strong>{" "}
            {user ? user.fullName : "Loading..."}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {user ? user.email : "Loading..."}
          </p>

          <p>
            <strong>Member Since:</strong>{" "}
            {user
              ? new Date(user.createdAt).toLocaleDateString()
              : "Loading..."}
          </p>
        </div>

        <br />

        {/* Change Password */}

        <div style={cardStyle}>
          <h2>🔑 Change Password</h2>

          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            style={buttonStyle}
            onClick={changePassword}
            disabled={loading}
          >
            Change Password
          </button>
        </div>

        <br />

        {/* Delete Account */}

        <div style={cardStyle}>
          <h2 style={{ color: "#dc2626" }}>
            ❌ Delete Account
          </h2>

          <p>
            This action is permanent and cannot be undone.
          </p>

          <input
            type="password"
            placeholder="Enter Password"
            value={deletePassword}
            onChange={(e) =>
              setDeletePassword(e.target.value)
            }
            style={inputStyle}
          />

<button
  style={{
    ...buttonStyle,
    background: "#f59e0b",
  }}
  onClick={sendOTP}
  disabled={loading}
>
  Verify Password & Send OTP
</button>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={inputStyle}
          />
                    <button
  onClick={deleteAccount}
  disabled={!otpSent || loading}
  style={{
    ...buttonStyle,
    background: "#dc2626",
    opacity: otpSent ? 1 : 0.5,
  }}
>
  Delete Account Permanently
</button>
        </div>

        <br />

        {/* Navigation */}

        <div
          style={{
            display: "flex",
            gap: "15px",
          }}
        >
          <button
            style={buttonStyle}
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            style={{
              ...buttonStyle,
              background: "#555",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  async function deleteAccount() {
    try {
      if (!deletePassword || !otp) {
        alert("Please enter password and OTP");
        return;
      }

      setLoading(true);

      const res = await api.post("/auth/delete-account", {
        password: deletePassword,
        otp,
      });

      alert(res.data.message);

      localStorage.removeItem("token");

      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  }
}

const cardStyle: React.CSSProperties = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  marginTop: "10px",
};