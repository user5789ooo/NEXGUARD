
import {
  Activity,
  LayoutDashboard,
  Smartphone,
  Users,
  MapPin,
  Settings as SettingsIcon,
  ShieldCheck,
  LogOut
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate
} from "react-router-dom";

import { useState } from "react";
import { signOut } from "../services/auth";

const navigation = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Devices", path: "/devices", icon: Smartphone },
  { label: "Customers", path: "/customers", icon: Users },
  { label: "Recovery System", path: "/recovery", icon: MapPin },
  { label: "Activity Logs", path: "/activity", icon: Activity },
  { label: "Settings", path: "/settings", icon: SettingsIcon }
];

export default function Layout() {
  const navigate = useNavigate();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setError("");

    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sign out failed. Please try again."
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={24} />
          </div>

          <div>
            <div className="brand-name">NEXGUARD</div>
            <div style={{ color: "#8c9ab3", fontSize: 10 }}>
              DEVICE MANAGEMENT
            </div>
          </div>
        </div>

        <div className="nav-label">Workspace</div>

        <nav>
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ marginTop: 35, padding: 13 }}>
          <div className="panel" style={{ padding: 14 }}>
            <ShieldCheck size={20} color="#36d399" />

            <p style={{ fontSize: 12, fontWeight: 600 }}>
              Security Center
            </p>

            <p className="page-subtitle">
              Secure access and consent-based device management.
            </p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            style={{
              color: "#ff6b6b",
              fontSize: 12,
              padding: "0 13px"
            }}
          >
            {error}
          </p>
        )}

        <button
          className="nav-link"
          style={{
            width: "100%",
            marginTop: 20,
            background: "transparent",
            border: 0,
            cursor: isSigningOut ? "wait" : "pointer",
            opacity: isSigningOut ? 0.6 : 1
          }}
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut size={19} />
          <span>
            {isSigningOut ? "Signing out..." : "Sign out"}
          </span>
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
