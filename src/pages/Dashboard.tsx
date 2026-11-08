
import { Activity, BatteryCharging, MapPin, Smartphone, Users, Wifi } from "lucide-react";

const stats = [
  { label: "Registered Devices", value: "0", icon: Smartphone, color: "#8294ff" },
  { label: "Registered Customers", value: "0", icon: Users, color: "#36d399" },
  { label: "Online Devices", value: "0", icon: Wifi, color: "#29c5d8" },
  { label: "Recovery Cases", value: "0", icon: MapPin, color: "#f5b942" }
];

export default function Dashboard() {
  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">
            Welcome to NEXGUARD device management.
          </p>
        </div>
        <span className="status online">● System Ready</span>
      </div>

      <div className="stat-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div className="stat-card" key={item.label}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="stat-label">{item.label}</span>
                <Icon size={21} color={item.color} />
              </div>
              <div className="stat-value">{item.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginTop: 22 }}>
        <section className="panel">
          <h3>Device Monitoring</h3>
          <p className="page-subtitle">
            Battery and charging information from enrolled devices will appear here.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 25 }}>
            <BatteryCharging color="#36d399" size={25} />
            <div>
              <strong>Battery Monitoring</strong>
              <p className="page-subtitle">Waiting for device enrollment</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <h3>Recovery System</h3>
          <p className="page-subtitle">
            Customer-authorized lost-device recovery requests.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 25 }}>
            <MapPin color="#8294ff" size={25} />
            <div>
              <strong>Location Recovery</strong>
              <p className="page-subtitle">No recovery cases yet</p>
            </div>
          </div>
        </section>
      </div>

      <section className="panel" style={{ marginTop: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Activity size={20} color="#8294ff" />
          <h3>Recent Activity</h3>
        </div>
        <div className="empty-state">
          No activity recorded yet.
        </div>
      </section>

      <p className="page-subtitle" style={{ marginTop: 20 }}>
        Dashboard preview · Live data will appear after secure backend integration.
      </p>
    </div>
  );
}
