import { useEffect, useState } from "react";
import api from "../services/api";

interface Device {
  _id: string;
  deviceName: string;
  browser: string;
  os: string;
  trusted: boolean;
}

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const res = await api.get("/device/list");
      setDevices(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load devices");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>Trusted Devices</h1>

      {devices.length === 0 ? (
        <p>No trusted devices found.</p>
      ) : (
        devices.map((device) => (
          <div
            key={device._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h3>{device.deviceName}</h3>

            <p>
              <strong>Browser:</strong> {device.browser}
            </p>

            <p>
              <strong>Operating System:</strong> {device.os}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {device.trusted ? "✅ Trusted" : "❌ Not Trusted"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}