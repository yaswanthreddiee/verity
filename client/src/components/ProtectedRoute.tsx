import { useEffect } from "react";
import type { ReactElement } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../services/api";
import { socket } from "../services/socket";

interface ProtectedRouteProps {
  children: ReactElement;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const initializeSocket = async () => {
      try {
        const res = await api.get("/auth/me");

        socket.connect();

        socket.emit("join", res.data.user._id);

        socket.on("ACCOUNT_DELETED", () => {
          alert("Your account has been deleted.");

          localStorage.removeItem("token");

          socket.disconnect();

          navigate("/", { replace: true });
        });
      } catch (err) {
        console.error(err);
      }
    };

    initializeSocket();

    return () => {
      socket.off("ACCOUNT_DELETED");
    };
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}