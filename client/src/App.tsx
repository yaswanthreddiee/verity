import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QRVerification from "./pages/QRVerification";
import Devices from "./pages/Devices";
import TrustCircle from "./pages/TrustCircle";
import PendingRequests from "./pages/PendingRequests";
import ApprovePage from "./pages/ApprovePage";
import Recovery from "./pages/Recovery";
import RecoveryRequests from "./pages/RecoveryRequests";
import AccountSettings from "./pages/AccountSettings";
import RecoverAccount from "./pages/RecoverAccount";
import EmailOTPRecovery from "./pages/EmailOTPRecovery";
import ResetPassword from "./pages/ResetPassword";
import TrustedDeviceRecovery from "./pages/TrustedDeviceRecovery";

import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
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
        <Route path="/recovery" element={<Recovery />} />

<Route
  path="/recovery-requests"
  element={<RecoveryRequests />}
/>

<Route
  path="/settings"
  element={<AccountSettings />}
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
  path="/recover-account"
  element={<RecoverAccount />}
/>
        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <Devices />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LandingPage />} />

<Route
    path="/forgot-password/otp"
    element={<EmailOTPRecovery />}
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
  path="/forgot-password/trusted-device"
  element={<TrustedDeviceRecovery />}
/>
<Route
    path="/reset-password"
    element={<ResetPassword />}
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
        <Route
  path="/approve/password/:challengeId"
  element={<ApprovePage />}
/>
      </Routes>
    </BrowserRouter>

    
  );
}

export default App;