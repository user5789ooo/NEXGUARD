
import {
  Smartphone,
  BatteryCharging,
  Wifi,
  Search,
  Plus,
  ShieldCheck,
  X,
  Save,
  RefreshCw,
  Link2,
  CheckCircle2
} from "lucide-react";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

type Customer = {
  id: string;
  full_name: string;
  phone: string;
};

type Device = {
  id: string;
  customer_id: string;
  device_name: string;
  model: string;
  device_uid: string;
  created_at: string;
  customers: {
    full_name: string;
  } | null;
};

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pairing, setPairing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [customerId, setCustomerId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [model, setModel] = useState("");
  const [deviceUid, setDeviceUid] = useState("");

  const [pairCode, setPairCode] = useState("");

  const loadData = useCallback(async () => {
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const [deviceResult, customerResult] = await Promise.all([
      supabase
        .from("devices")
        .select(
          "id, customer_id, device_name, model, device_uid, created_at, customers(full_name)"
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("customers")
        .select("id, full_name, phone")
        .order("full_name", { ascending: true })
    ]);

    if (deviceResult.error) {
      setError(deviceResult.error.message);
      setDevices([]);
    } else {
      setDevices((deviceResult.data ?? []) as unknown as Device[]);
    }

    if (customerResult.error) {
      setError(customerResult.error.message);
      setCustomers([]);
    } else {
      setCustomers((customerResult.data ?? []) as Customer[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handlePairDevice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    const cleanCode = pairCode.replace(/\D/g, "");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!/^\d{8}$/.test(cleanCode)) {
      setError("Enter a valid 8-digit Connection Code.");
      return;
    }

    setPairing(true);
    setError("");
    setSuccess("");

    try {
      const { data, error: pairError } =
        await supabase.functions.invoke("pair-device", {
          body: {
            code: cleanCode,
            customer_id: customerId
          }
        });

      if (pairError) {
        throw new Error(pairError.message || "Device pairing failed.");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Could not pair device.");
      }

      setPairCode("");
      setCustomerId("");

      setSuccess(
        `Device ${data.device_name || ""} paired successfully.`
      );

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Device pairing failed."
      );
    } finally {
      setPairing(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    const cleanName = deviceName.trim();
    const cleanModel = model.trim();
    const cleanUid = deviceUid.trim();

    if (!cleanName || !cleanModel || !cleanUid) {
      setError("Please fill in all device details.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setError("Please log in again.");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("devices")
      .insert({
        owner_id: userData.user.id,
        customer_id: customerId,
        device_name: cleanName,
        model: cleanModel,
        device_uid: cleanUid
      });

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "This Device ID is already registered."
          : insertError.message
      );
      setSaving(false);
      return;
    }

    setDeviceName("");
    setModel("");
    setDeviceUid("");
    setCustomerId("");
    setShowForm(false);
    setSuccess("Device registered successfully.");

    await loadData();
    setSaving(false);
  };

  const filteredDevices = devices.filter((device) =>
    `${device.device_name} ${device.model} ${device.device_uid} ${device.customers?.full_name ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="page-title">Device Management</h1>
          <p className="page-subtitle">
            Pair Android devices and manage customer devices.
          </p>
        </div>

        <button
          className="btn"
          onClick={() => {
            setError("");
            setSuccess("");
            setShowForm(true);
          }}
        >
          <Plus size={17} />
          Register Device
        </button>
      </div>

      {error && (
        <div className="panel" style={{ marginBottom: 16, color: "#ff7777" }}>
          {error}
        </div>
      )}

      {success && (
        <div className="panel" style={{ marginBottom: 16, color: "#36d399" }}>
          <CheckCircle2 size={18} style={{ verticalAlign: "middle" }} />{" "}
          {success}
        </div>
      )}

      <section className="panel" style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <Link2 size={23} color="#8294ff" />
          <div>
            <h3>Pair Android Device</h3>
            <p className="page-subtitle">
              Connect a phone using its 8-digit Connection Code.
            </p>
          </div>
        </div>

        {customers.length === 0 ? (
          <p className="page-subtitle">
            Register a customer first before pairing a device.
          </p>
        ) : (
          <form onSubmit={handlePairDevice}>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label>Select Customer *</label>
                <select
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                  required
                  style={{ width: "100%" }}
                >
                  <option value="">Choose a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.full_name} — {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>8-Digit Connection Code *</label>
                <input
                  value={pairCode}
                  onChange={(event) =>
                    setPairCode(event.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  placeholder="Enter code from Android APK"
                  inputMode="numeric"
                  maxLength={8}
                  required
                  style={{
                    width: "100%",
                    letterSpacing: 5,
                    fontSize: 22,
                    fontWeight: 700
                  }}
                />
                <p className="page-subtitle">
                  The code expires after 10 minutes and can only be used once.
                </p>
              </div>

              <button className="btn" type="submit" disabled={pairing}>
                <Link2 size={17} />
                {pairing ? "Connecting..." : "Connect Device"}
              </button>
            </div>
          </form>
        )}
      </section>

      {showForm && (
        <section className="panel" style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18
            }}
          >
            <h3>Register New Device</h3>

            <button
              type="button"
              className="btn"
              onClick={() => setShowForm(false)}
              style={{ padding: "8px 12px" }}
            >
              <X size={17} />
            </button>
          </div>

          {customers.length === 0 ? (
            <p className="page-subtitle">
              Register a customer first before adding a device.
            </p>
          ) : (
            <form onSubmit={handleRegister}>
              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <label>Select Customer *</label>
                  <select
                    value={customerId}
                    onChange={(event) => setCustomerId(event.target.value)}
                    required
                    style={{ width: "100%" }}
                  >
                    <option value="">Choose a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name} — {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Device Name *</label>
                  <input
                    value={deviceName}
                    onChange={(event) => setDeviceName(event.target.value)}
                    placeholder="Example: My Android Phone"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label>Device Model *</label>
                  <input
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                    placeholder="Example: Redmi Turbo 5"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label>Unique Device ID *</label>
                  <input
                    value={deviceUid}
                    onChange={(event) => setDeviceUid(event.target.value)}
                    placeholder="Enter a unique device ID"
                    maxLength={120}
                    required
                  />
                </div>

                <button className="btn" type="submit" disabled={saving}>
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Device"}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <div className="stat-grid">
        <div className="stat-card">
          <Smartphone color="#8294ff" size={23} />
          <div className="stat-label">Total Devices</div>
          <div className="stat-value">{devices.length}</div>
        </div>

        <div className="stat-card">
          <Wifi color="#36d399" size={23} />
          <div className="stat-label">Online</div>
          <div className="stat-value">0</div>
        </div>

        <div className="stat-card">
          <BatteryCharging color="#f5b942" size={23} />
          <div className="stat-label">Charging</div>
          <div className="stat-value">0</div>
        </div>

        <div className="stat-card">
          <ShieldCheck color="#29c5d8" size={23} />
          <div className="stat-label">Registered</div>
          <div className="stat-value">{devices.length}</div>
        </div>
      </div>

      <section className="panel" style={{ marginTop: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 15,
            flexWrap: "wrap"
          }}
        >
          <div>
            <h3>Registered Devices</h3>
            <p className="page-subtitle">
              Devices linked to customer records.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search devices..."
                style={{ paddingLeft: 38 }}
              />
            </div>

            <button
              className="btn"
              onClick={() => void loadData()}
              disabled={loading}
              title="Refresh devices"
              style={{ padding: "10px 12px" }}
            >
              <RefreshCw size={17} />
            </button>
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
                <th>LAST SEEN</th>
              </tr>
            </thead>

            <tbody>
              {filteredDevices.map((device) => (
                <tr key={device.id}>
                  <td>
                    <strong>{device.device_name}</strong>
                    <div className="page-subtitle">{device.model}</div>
                    <div className="page-subtitle">{device.device_uid}</div>
                  </td>
                  <td>{device.customers?.full_name ?? "Unknown"}</td>
                  <td>
                    <span className="status offline">Status unavailable</span>
                  </td>
                  <td>Unavailable</td>
                  <td>Not available</td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="empty-state">Loading devices...</div>
          )}

          {!loading && filteredDevices.length === 0 && (
            <div className="empty-state">
              <Smartphone size={35} style={{ opacity: 0.5 }} />
              <h3>
                {search ? "No matching devices" : "No devices registered"}
              </h3>
              <p>
                {search
                  ? "Try another device or customer name."
                  : "Pair an Android device or register your first device."}
              </p>
            </div>
          )}
        </div>
      </section>

      <p className="page-subtitle" style={{ marginTop: 18 }}>
        Pairing verifies the device connection. Live status and telemetry
        require the Android Companion App to send updates.
      </p>
    </div>
  );
}
