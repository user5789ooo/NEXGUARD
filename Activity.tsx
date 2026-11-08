
import {
  Activity as ActivityIcon,
  Search,
  ShieldCheck,
  Smartphone,
  Users,
  MapPin,
  Clock,
  Filter
} from "lucide-react";
import { useState } from "react";

type ActivityRecord = {
  id: string;
  action: string;
  actor: string;
  target: string;
  category: "Device" | "Customer" | "Recovery" | "Security";
  timestamp: string;
};

const categoryIcons = {
  Device: Smartphone,
  Customer: Users,
  Recovery: MapPin,
  Security: ShieldCheck
};

export default function Activity() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Audit records will be fetched from the protected backend.
  const [records] = useState<ActivityRecord[]>([]);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      `${record.action} ${record.actor} ${record.target}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || record.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="page-title">Activity Logs</h1>
          <p className="page-subtitle">
            Monitor administrative activity and security events.
          </p>
        </div>

        <span className="status online">
          <ShieldCheck size={14} />
          Audit Monitoring
        </span>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <ActivityIcon size={23} color="#8294ff" />
          <div className="stat-label">Total Events</div>
          <div className="stat-value">{records.length}</div>
        </div>

        <div className="stat-card">
          <Smartphone size={23} color="#29c5d8" />
          <div className="stat-label">Device Events</div>
          <div className="stat-value">
            {records.filter((r) => r.category === "Device").length}
          </div>
        </div>

        <div className="stat-card">
          <Users size={23} color="#36d399" />
          <div className="stat-label">Customer Events</div>
          <div className="stat-value">
            {records.filter((r) => r.category === "Customer").length}
          </div>
        </div>

        <div className="stat-card">
          <ShieldCheck size={23} color="#f5b942" />
          <div className="stat-label">Security Events</div>
          <div className="stat-value">
            {records.filter((r) => r.category === "Security").length}
          </div>
        </div>
      </div>

      <section className="panel" style={{ marginTop: 22 }}>
        <h3>Audit History</h3>

        <p className="page-subtitle">
          Recorded actions with actor, target, category and timestamp.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 20
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
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
              placeholder="Search activity..."
              style={{ paddingLeft: 38 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={17} color="#8c9ab3" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: 165 }}
            >
              <option value="All">All Categories</option>
              <option value="Device">Device</option>
              <option value="Customer">Customer</option>
              <option value="Recovery">Recovery</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>EVENT</th>
                <th>ACTOR</th>
                <th>TARGET</th>
                <th>CATEGORY</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => {
                const Icon = categoryIcons[record.category];

                return (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.action}</strong>
                      <div className="page-subtitle">{record.id}</div>
                    </td>

                    <td>{record.actor}</td>
                    <td>{record.target}</td>

                    <td>
                      <span className="status online">
                        <Icon size={13} />
                        {record.category}
                      </span>
                    </td>

                    <td>{record.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="empty-state">
              <Clock size={36} style={{ opacity: 0.5 }} />
              <h3>No activity recorded</h3>
              <p>
                Verified administrative and system events will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="panel" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={21} color="#36d399" />
          <strong>Audit Security</strong>
        </div>

        <p className="page-subtitle">
          Production audit records must be server-generated, access-controlled,
          timestamped and protected against unauthorized modification.
          Do not store passwords, access tokens or unnecessary personal data.
        </p>
      </div>
    </div>
  );
}
