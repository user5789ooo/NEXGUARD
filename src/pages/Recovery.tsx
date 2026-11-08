
import {
  MapPin,
  Search,
  ShieldCheck,
  Clock,
  Plus,
  Smartphone,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

type RecoveryCase = {
  id: string;
  customer: string;
  device: string;
  status: "Open" | "Investigating" | "Resolved";
  consent: boolean;
  lastLocation: string;
  updatedAt: string;
};

export default function Recovery() {
  const [search, setSearch] = useState("");

  // Real recovery cases will load from the secure backend.
  const [cases] = useState<RecoveryCase[]>([]);

  const filteredCases = cases.filter((item) =>
    `${item.id} ${item.customer} ${item.device}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="page-title">Recovery System</h1>
          <p className="page-subtitle">
            Manage customer-authorized lost-device recovery cases.
          </p>
        </div>

        <button
          className="btn"
          onClick={() =>
            alert("Recovery case creation will be enabled after backend integration.")
          }
        >
          <Plus size={17} />
          New Recovery Case
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <MapPin size={23} color="#8294ff" />
          <div className="stat-label">Total Cases</div>
          <div className="stat-value">{cases.length}</div>
        </div>

        <div className="stat-card">
          <AlertTriangle size={23} color="#f5b942" />
          <div className="stat-label">Open Cases</div>
          <div className="stat-value">
            {cases.filter((c) => c.status === "Open").length}
          </div>
        </div>

        <div className="stat-card">
          <Clock size={23} color="#29c5d8" />
          <div className="stat-label">Investigating</div>
          <div className="stat-value">
            {cases.filter((c) => c.status === "Investigating").length}
          </div>
        </div>

        <div className="stat-card">
          <ShieldCheck size={23} color="#36d399" />
          <div className="stat-label">Resolved</div>
          <div className="stat-value">
            {cases.filter((c) => c.status === "Resolved").length}
          </div>
        </div>
      </div>

      <section className="panel" style={{ marginTop: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <MapPin size={23} color="#8294ff" />
          <div>
            <h3>Location Recovery</h3>
            <p className="page-subtitle">
              Location information is available only within the customer's consent and Android permission scope.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            minHeight: 190,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: 25,
            borderRadius: 14,
            border: "1px dashed var(--border)",
            background: "rgba(8, 11, 20, 0.5)"
          }}
        >
          <div>
            <MapPin size={38} color="#8294ff" />
            <h3>Recovery Map</h3>
            <p className="page-subtitle">
              No authorized location updates available.
            </p>
            <p className="page-subtitle">
              Live location requires an online device and active permission.
            </p>
          </div>
        </div>
      </section>

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
            <h3>Recovery Cases</h3>
            <p className="page-subtitle">
              Track lost-device reports and recovery progress.
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
              placeholder="Search recovery cases..."
              style={{ paddingLeft: 38 }}
            />
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>CASE ID</th>
                <th>CUSTOMER</th>
                <th>DEVICE</th>
                <th>CONSENT</th>
                <th>LAST LOCATION</th>
                <th>STATUS</th>
                <th>UPDATED</th>
              </tr>
            </thead>

            <tbody>
              {filteredCases.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.customer}</td>
                  <td>{item.device}</td>

                  <td>
                    <span className={`status ${item.consent ? "online" : "offline"}`}>
                      {item.consent ? "Granted" : "Not granted"}
                    </span>
                  </td>

                  <td>{item.lastLocation}</td>

                  <td>
                    <span className={`status ${
                      item.status === "Resolved"
                        ? "online"
                        : item.status === "Open"
                          ? "pending"
                          : "offline"
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  <td>{item.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCases.length === 0 && (
            <div className="empty-state">
              <Smartphone size={36} style={{ opacity: 0.5 }} />
              <h3>No recovery cases</h3>
              <p>
                Customer-authorized recovery requests will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      <div
        className="panel"
        style={{
          marginTop: 20,
          borderColor: "rgba(245, 185, 66, 0.25)"
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <AlertTriangle color="#f5b942" size={21} />
          <div>
            <strong>Recovery limitations</strong>
            <p className="page-subtitle">
              Powered-off or disconnected phones cannot transmit live location.
              Last-known location must include its original timestamp.
              Revoked permissions stop further location collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
