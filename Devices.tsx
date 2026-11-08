
import {
  Smartphone,
  BatteryCharging,
  Wifi,
  Search,
  Plus,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";

type Device = {
  id: string;
  model: string;
  customer: string;
  status: "Online" | "Offline";
  battery: number | null;
  charging: boolean | null;
  lastSeen: string;
};

export default function Devices() {
  const [search, setSearch] = useState("");

  // Empty until real devices are enrolled through the Android app.
  const [devices] = useState<Device[]>([]);

  const filteredDevices = devices.filter((device) =>
    `${device.id} ${device.model} ${device.customer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="page-title">Device Management</h1>
          <p className="page-subtitle">
            Manage enrolled devices and view consent-based telemetry.
          </p>
        </div>

        <button className="btn" onClick={() => alert("Device pairing will be available after backend integration.")}>
          <Plus size={17} />
          Register Device
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <Smartphone color="#8294ff" size={23} />
          <div className="stat-label">Total Devices</div>
          <div className="stat-value">{devices.length}</div>
        </div>

        <div className="stat-card">
          <Wifi color="#36d399" size={23} />
          <div className="stat-label">Online</div>
          <div className="stat-value">
            {devices.filter((d) => d.status === "Online").length}
          </div>
        </div>

        <div className="stat-card">
          <BatteryCharging color="#f5b942" size={23} />
          <div className="stat-label">Charging</div>
          <div className="stat-value">
            {devices.filter((d) => d.charging === true).length}
          </div>
        </div>

        <div className="stat-card">
          <ShieldCheck color="#29c5d8" size={23} />
          <div className="stat-label">Enrolled</div>
          <div className="stat-value">{devices.length}</div>
        </div>
      </div>

      <section className="panel" style={{ marginTop: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 15, flexWrap: "wrap" }}>
          <div>
            <h3>Registered Devices</h3>
            <p className="page-subtitle">
              Device information reported by authorized companion apps.
            </p>
          </div>

          <div style={{ position: "relative", width: 260, maxWidth: "100%" }}>
            <Search
              size={17}
              style={{
                position: "absolute",
                left: 12,
                top: 13,
                color: "#8c9ab3"
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search devices..."
              style={{ paddingLeft: 38 }}
            />
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>DEVICE</th>
                <th>CUSTOMER</th>
                <th>STATUS</th>
                <th>BATTERY</th>
                <th>CHARGING</th>
                <th>LAST SEEN</th>
              </tr>
            </thead>

            <tbody>
              {filteredDevices.map((device) => (
                <tr key={device.id}>
                  <td>
                    <strong>{device.model}</strong>
                    <div className="page-subtitle">{device.id}</div>
                  </td>

                  <td>{device.customer}</td>

                  <td>
                    <span className={`status ${device.status === "Online" ? "online" : "offline"}`}>
                      {device.status}
                    </span>
                  </td>

                  <td>
                    {device.battery === null
                      ? "Unavailable"
                      : `${device.battery}%`}
                  </td>

                  <td>
                    {device.charging === null
                      ? "Unavailable"
                      : device.charging
                        ? "Charging"
                        : "Not charging"}
                  </td>

                  <td>{device.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDevices.length === 0 && (
            <div className="empty-state">
              <Smartphone size={35} style={{ opacity: 0.5 }} />
              <h3>No devices registered</h3>
              <p>
                Enrolled devices will appear here after secure pairing.
              </p>
            </div>
          )}
        </div>
      </section>

      <p className="page-subtitle" style={{ marginTop: 18 }}>
        Device telemetry is currently awaiting Android app and backend integration.
      </p>
    </div>
  );
}
