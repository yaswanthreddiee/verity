import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QRVerification from "./pages/QRVerification";
import Devices from "./pages/Devices";
import TrustCircle from "./pages/TrustCircle";
import PendingRequests from "./pages/PendingRequests";
import ApprovePage from "./pages/ApprovePage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verify"
          element={
            <ProtectedRoute>
              <QRVerification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <Devices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trust-circle"
          element={
            <ProtectedRoute>
              <TrustCircle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending"
          element={
            <ProtectedRoute>
              <PendingRequests />
            </ProtectedRoute>
          }
        />

        {/* Public route (used when another device scans the QR code) */}
        <Route
          path="/approve/:challengeId"
          element={<ApprovePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;