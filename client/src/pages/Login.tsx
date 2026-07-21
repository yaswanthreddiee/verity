import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { getDeviceId } from "../utils/device";
import { getDeviceInfo } from "../utils/deviceInfo";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      // Step 1: Authenticate user
      const loginRes = await api.post("/auth/login", {
        email,
        password,
      });

      // Save JWT token
      localStorage.setItem("token", loginRes.data.token);

      // Step 2: Get current device ID
      const deviceId = getDeviceId();

      // Step 3: Evaluate device context
      const check = await api.post("/context/evaluate", {
        deviceId,
      });

      const action = check.data.action;

      // First login from this device
      if (action === "FIRST_LOGIN") {
        await api.post("/device/register", {
          ...getDeviceInfo(),
          trusted: true,
        });

        navigate("/dashboard");
        return;
      }

      // Already trusted device
      if (action === "LOGIN") {
        navigate("/dashboard");
        return;
      }

      // New device → QR Verification
      if (action === "TRUST_CIRCLE") {
        const qr = await api.post("/qr/generate", {
          deviceId,
        });

        navigate("/verify", {
          state: {
            challengeId: qr.data.challengeId,
          },
        });

        return;
      }

      alert("Unknown authentication response.");
    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Login Failed. Please try again."
      );
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Verity Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <button
        onClick={login}
        style={{
          width: "100%",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Login
      </button>

      <br />
      <br />

      <Link to="/register">Create Account</Link>
      <Link to="/recover-account">
    Recover Account
</Link>
    </div>
  );
}