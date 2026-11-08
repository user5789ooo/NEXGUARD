
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Lock,
  Bell,
  Database,
  Building2,
  Save,
  Eye,
  Smartphone
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [organization, setOrganization] = useState("NEXGUARD");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [locationRetention, setLocationRetention] = useState("30");
  const [auditRetention, setAuditRetention] = useState("365");

  const saveSettings = () => {
    alert(
      "Settings preview saved locally for this session. Backend persistence is not configured yet."
    );
  };

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Configure organization, privacy and security preferences.
          </p>
        </div>

        <button className="btn" onClick={saveSettings}>
          <Save size={17} />
          Save Settings
        </button>
      </div>

      <section className="panel">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Building2 size={21} color="#8294ff" />
          <h3>Organization Profile</h3>
        </div>

        <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
          <label>
            <span className="stat-label">Organization Name</span>
            <input
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              style={{ marginTop: 8 }}
            />
          </label>

          <label>
            <span className="stat-label">Administrator Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{ marginTop: 8 }}
            />
          </label>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Bell size={21} color="#f5b942" />
          <h3>Notifications</h3>
        </div>

        <div style={{ display: "grid", gap: 18, marginTop: 20 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span>
              <strong>System Notifications</strong>
              <p className="page-subtitle">
                Receive important system and device updates.
              </p>
            </span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="checkbox"
              checked={securityAlerts}
              onChange={(e) => setSecurityAlerts(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span>
              <strong>Security Alerts</strong>
              <p className="page-subtitle">
                Receive alerts about authentication and security events.
              </p>
            </span>
          </label>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={21} color="#36d399" />
          <h3>Privacy & Data Retention</h3>
        </div>

        <div style={{ display: "grid", gap: 18, marginTop: 20 }}>
          <label>
            <span className="stat-label">
              Location History Retention
            </span>
            <select
              value={locationRetention}
              onChange={(e) => setLocationRetention(e.target.value)}
              style={{ marginTop: 8 }}
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </label>

          <label>
            <span className="stat-label">
              Audit Log Retention
            </span>
            <select
              value={auditRetention}
              onChange={(e) => setAuditRetention(e.target.value)}
              style={{ marginTop: 8 }}
            >
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">365 days</option>
            </select>
          </label>
        </div>

        <p className="page-subtitle" style={{ marginTop: 16 }}>
          Retention preferences are not yet enforced by a backend. Production
          policies must follow applicable laws and documented customer consent.
        </p>
      </section>

      <section className="panel" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Lock size={21} color="#8294ff" />
          <h3>Security & Access</h3>
        </div>

        <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ShieldCheck size={20} color="#36d399" />
            <div>
              <strong>Role-Based Access</strong>
              <p className="page-subtitle">
                Admin and staff permissions will be enforced by the backend.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Eye size={20} color="#8294ff" />
            <div>
              <strong>Consent Management</strong>
              <p className="page-subtitle">
                Customers must be able to review and revoke optional permissions.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Smartphone size={20} color="#29c5d8" />
            <div>
              <strong>Device Enrollment</strong>
              <p className="page-subtitle">
                Only transparently enrolled and authorized devices can connect.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Database size={20} color="#f5b942" />
            <div>
              <strong>Secure Database</strong>
              <p className="page-subtitle">
                Database access will use authentication and Row Level Security.
              </p>
            </div>
          </div>
        </div>
      </section>

      <p className="page-subtitle" style={{ marginTop: 20 }}>
        <SettingsIcon size={14} style={{ display: "inline" }} /> NEXGUARD
        Configuration · Backend integration pending
      </p>
    </div>
  );
}
