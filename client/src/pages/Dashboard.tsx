import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1>Verity Dashboard</h1>

      <p>✅ Login Successful</p>

      <Link to="/devices">
        <button>Trusted Devices</button>
      </Link>

      <Link to="/trust-circle">
        <button>Trust Circle</button>
      </Link>

      <Link to="/pending">
        <button>Pending Requests</button>
      </Link>

      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          width: "150px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}