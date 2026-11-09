
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Activity, BatteryCharging, MapPin, Smartphone, Users, Wifi,
  ShieldCheck, Mic, Lock, AlertTriangle, Clock, Radio, Info,
  Contact, Network, MapPinned, History, RefreshCw
} from "lucide-react";
import { supabase } from "../lib/supabase";

type Telemetry = {
  id: string;
  device_id: string;
  battery_level: number | null;
  is_charging: boolean | null;
  device_status: string;
  wifi_status: string;
  mobile_data_status: string;
  network_type: string | null;
  signal_status: string | null;
  recorded_at: string;
};

const pendingStyle = {
  color: "#f5b942",
  background: "rgba(245,185,66,0.12)",
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600
} as const;

function StatusCard({
  label,
  status = "Integration Pending"
}: {
  label: string;
  status?: string;
}) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <p style={pendingStyle}>{status}</p>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="page-subtitle" style={{
      marginTop: 15,
      display: "flex",
      alignItems: "flex-start",
      gap: 7
    }}>
      <Info size={15} style={{ flexShrink: 0, marginTop: 2 }} />
      <span>{children}</span>
    </p>
  );
}

function SectionTitle({
  icon,
  children
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {icon}
      <h3>{children}</h3>
    </div>
  );
}

export default function Dashboard() {
  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async () => {
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const [devicesResult, customersResult, telemetryResult] =
      await Promise.all([
        supabase.from("devices").select("id", {
          count: "exact",
          head: true
        }),
        supabase.from("customers").select("id", {
          count: "exact",
          head: true
        }),
        supabase
          .from("device_telemetry")
          .select(
            "id, device_id, battery_level, is_charging, device_status, wifi_status, mobile_data_status, network_type, signal_status, recorded_at"
          )
          .order("recorded_at", { ascending: false })
          .limit(100)
      ]);

    if (devicesResult.error || customersResult.error || telemetryResult.error) {
      setError(
        devicesResult.error?.message ||
        customersResult.error?.message ||
        telemetryResult.error?.message ||
        "Unable to load dashboard data."
      );
    } else {
      setDeviceCount(devicesResult.count ?? 0);
      setCustomerCount(customersResult.count ?? 0);

      const latestByDevice = new Map<string, Telemetry>();

      for (const item of (telemetryResult.data ?? []) as Telemetry[]) {
        if (!latestByDevice.has(item.device_id)) {
          latestByDevice.set(item.device_id, item);
        }
      }

      setTelemetry(Array.from(latestByDevice.values()));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const onlineCount = telemetry.filter(
    (item) => item.device_status === "online"
  ).length;

  const stats = [
    {
      label: "Registered Devices",
      value: deviceCount === null ? "—" : String(deviceCount),
      icon: Smartphone,
      color: "#8294ff"
    },
    {
      label: "Registered Customers",
      value: customerCount === null ? "—" : String(customerCount),
      icon: Users,
      color: "#36d399"
    },
    {
      label: "Online Devices",
      value: telemetry.length === 0 ? "—" : String(onlineCount),
      icon: Wifi,
      color: "#29c5d8"
    },
    {
      label: "Recovery Cases",
      value: "Pending",
      icon: MapPin,
      color: "#f5b942"
    }
  ];

  const latestTelemetry = [...telemetry].sort(
    (a, b) =>
      new Date(b.recorded_at).getTime() -
      new Date(a.recorded_at).getTime()
  );

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="page-title">NEXGUARD Overview</h1>
          <p className="page-subtitle">
            Device management and authorized recovery dashboard.
          </p>
        </div>

        <button
          className="btn"
          onClick={() => void loadDashboardData()}
          disabled={loading}
          style={{ padding: "10px 12px" }}
        >
          <RefreshCw size={18} />
          {loading ? "Loading" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="panel" style={{ marginBottom: 16, color: "#ff7777" }}>
          Dashboard data error: {error}
        </div>
      )}

      <div className="stat-grid">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div className="stat-card" key={item.label}>
              <div style={{
                display: "flex",
                justifyContent: "space-between"
              }}>
                <span className="stat-label">{item.label}</span>
                <Icon size={21} color={item.color} />
              </div>
              <div className="stat-value">{item.value}</div>
            </div>
          );
        })}
      </div>

      <p className="page-subtitle" style={{ marginTop: 12 }}>
        {loading
          ? "Loading database and device telemetry..."
          : "Device and customer totals are read from Supabase."}
      </p>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<BatteryCharging color="#36d399" size={23} />}>
          Live Device Telemetry
        </SectionTitle>

        <p className="page-subtitle">
          Latest status reports received from authorized companion apps.
        </p>

        {latestTelemetry.length === 0 ? (
          <div className="empty-state">
            <Smartphone size={34} style={{ opacity: 0.5 }} />
            <h3>No telemetry received</h3>
            <p>
              Device status will appear after an authorized Android
              Companion App sends its first report.
            </p>
          </div>
        ) : (
          <div className="table-wrap" style={{ marginTop: 18 }}>
            <table>
              <thead>
                <tr>
                  <th>DEVICE ID</th>
                  <th>STATUS</th>
                  <th>BATTERY</th>
                  <th>CHARGING</th>
                  <th>WI-FI</th>
                  <th>MOBILE DATA</th>
                  <th>LAST UPDATE</th>
                </tr>
              </thead>
              <tbody>
                {latestTelemetry.map((item) => (
                  <tr key={item.id}>
                    <td>{item.device_id.slice(0, 8)}</td>
                    <td>{item.device_status}</td>
                    <td>
                      {item.battery_level === null
                        ? "Unknown"
                        : `${item.battery_level}%`}
                    </td>
                    <td>
                      {item.is_charging === null
                        ? "Unknown"
                        : item.is_charging
                          ? "Yes"
                          : "No"}
                    </td>
                    <td>{item.wifi_status}</td>
                    <td>{item.mobile_data_status}</td>
                    <td>
                      {new Date(item.recorded_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<ShieldCheck color="#36d399" size={23} />}>
          App Uninstall Control
        </SectionTitle>
        <p className="page-subtitle">
          Manage uninstall restrictions for properly enrolled company-owned devices.
        </p>
        <div className="stat-grid" style={{ marginTop: 18 }}>
          <StatusCard label="Uninstall Protection" />
          <StatusCard label="Device Owner Enrollment" status="Not Connected" />
          <StatusCard label="Managed Devices" status="0" />
        </div>
        <Note>
          Uninstall restrictions require Android Enterprise Device Owner
          enrollment. Personal phone owners retain control of their own devices.
        </Note>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<Mic color="#8294ff" size={23} />}>
          Voice Access Control
        </SectionTitle>
        <p className="page-subtitle">
          Customer-approved voice sessions for lost-phone recovery.
        </p>
        <div className="stat-grid" style={{ marginTop: 18 }}>
          <StatusCard label="Voice Integration" />
          <StatusCard label="Microphone Permission" status="Not Connected" />
          <StatusCard label="Session Status" status="No Active Session" />
        </div>
        <Note>
          Every session requires explicit customer approval, Android microphone
          permission, a visible foreground notification and a stop control.
          No silent recording.
        </Note>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<MapPinned color="#29c5d8" size={23} />}>
          Location Access Control
        </SectionTitle>
        <p className="page-subtitle">
          Customer-authorized device location and recovery status.
        </p>
        <div className="stat-grid" style={{ marginTop: 18 }}>
          <StatusCard label="Location Permission" status="Not Connected" />
          <StatusCard label="Customer Consent" status="Not Recorded" />
          <StatusCard label="Location Sharing" status="Inactive" />
          <StatusCard label="Last Permission Update" status="Not Available" />
        </div>
        <Note>
          Location access requires customer consent and Android location
          permissions. A customer can revoke permission from Android Settings.
        </Note>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<Contact color="#29c5d8" size={23} />}>
          Contact Access Control
        </SectionTitle>
        <p className="page-subtitle">
          Manage customer-selected contact sharing.
        </p>
        <div className="stat-grid" style={{ marginTop: 18 }}>
          <StatusCard label="Contact Permission" status="Not Connected" />
          <StatusCard label="Customer Consent" status="Not Recorded" />
          <StatusCard label="Shared Contacts" status="0" />
          <StatusCard label="Last Permission Update" status="Not Available" />
        </div>
        <Note>
          Customers must explicitly select and share contacts. NEXGUARD will
          not secretly read or copy a personal phone's contact list.
        </Note>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<Network color="#29c5d8" size={23} />}>
          Device Network Status
        </SectionTitle>
        <div className="stat-grid" style={{ marginTop: 18 }}>
          <StatusCard label="Mobile Data" status="Companion App Required" />
          <StatusCard label="Wi-Fi" status="Companion App Required" />
          <StatusCard label="Network Type" status="Companion App Required" />
          <StatusCard label="Signal Status" status="Companion App Required" />
        </div>
        <Note>
          Network status requires a paired companion app. The web dashboard
          cannot remotely force mobile data or Wi-Fi ON/OFF on ordinary Android
          phones.
        </Note>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<AlertTriangle color="#f5b942" size={23} />}>
          Lost Phone Recovery
        </SectionTitle>
        <p className="page-subtitle">
          Review and manage customer-reported lost or stolen devices.
        </p>
        <div className="stat-grid" style={{ marginTop: 18 }}>
          <StatusCard label="Recovery Requests" status="0" />
          <StatusCard label="Location Recovery" />
          <StatusCard label="Voice Recovery" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22 }}>
          <MapPin color="#8294ff" size={22} />
          <div>
            <strong>Last Known Location</strong>
            <p className="page-subtitle">No location data received yet.</p>
          </div>
        </div>

        <Note>
          Recovery requires verified device ownership and customer permissions.
          Offline devices, disabled GPS or revoked permissions may prevent live recovery.
        </Note>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<History color="#8294ff" size={22} />}>
          Permission Activity History
        </SectionTitle>
        <div className="empty-state">
          No permission activity recorded yet.
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<Lock color="#36d399" size={22} />}>
          Security & Admin Activity
        </SectionTitle>
        <div className="stat-grid" style={{ marginTop: 18 }}>
          <StatusCard label="Authentication" status="Dashboard Login" />
          <StatusCard label="Admin Audit Log" status="Integration Pending" />
          <StatusCard label="Device Security" status="Integration Pending" />
        </div>
      </section>

      <section className="panel" style={{ marginTop: 22 }}>
        <SectionTitle icon={<Activity color="#8294ff" size={22} />}>
          Recent Activity
        </SectionTitle>
        <div className="empty-state">
          No activity recorded yet.
        </div>
      </section>

      <p className="page-subtitle" style={{ marginTop: 20 }}>
        NEXGUARD Dashboard · Telemetry is displayed only when reported by an
        authorized Android Companion App.
      </p>
    </div>
  );
}
