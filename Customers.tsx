
import {
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  Smartphone,
  Mail
} from "lucide-react";
import { useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  devices: number;
  consent: "Granted" | "Pending" | "Revoked";
};

export default function Customers() {
  const [search, setSearch] = useState("");

  // Real customer records will load from Supabase later.
  const [customers] = useState<Customer[]>([]);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="topbar">
        <div>
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">
            Manage customer profiles and authorized device connections.
          </p>
        </div>

        <button
          className="btn"
          onClick={() =>
            alert("Customer registration will be enabled after Supabase integration.")
          }
        >
          <UserPlus size={17} />
          Add Customer
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <Users color="#8294ff" size={23} />
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{customers.length}</div>
        </div>

        <div className="stat-card">
          <Smartphone color="#29c5d8" size={23} />
          <div className="stat-label">Linked Devices</div>
          <div className="stat-value">
            {customers.reduce((sum, customer) => sum + customer.devices, 0)}
          </div>
        </div>

        <div className="stat-card">
          <ShieldCheck color="#36d399" size={23} />
          <div className="stat-label">Consent Granted</div>
          <div className="stat-value">
            {customers.filter((c) => c.consent === "Granted").length}
          </div>
        </div>

        <div className="stat-card">
          <Mail color="#f5b942" size={23} />
          <div className="stat-label">Pending Consent</div>
          <div className="stat-value">
            {customers.filter((c) => c.consent === "Pending").length}
          </div>
        </div>
      </div>

      <section className="panel" style={{ marginTop: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 15,
            flexWrap: "wrap"
          }}
        >
          <div>
            <h3>Customer Directory</h3>
            <p className="page-subtitle">
              Customer records and their consent status.
            </p>
          </div>

          <div style={{ position: "relative", width: 270, maxWidth: "100%" }}>
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
              placeholder="Search customers..."
              style={{ paddingLeft: 38 }}
            />
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>DEVICES</th>
                <th>CONSENT</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.name}</strong>
                    <div className="page-subtitle">{customer.id}</div>
                  </td>

                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.devices}</td>

                  <td>
                    <span
                      className={`status ${
                        customer.consent === "Granted"
                          ? "online"
                          : customer.consent === "Pending"
                            ? "pending"
                            : "offline"
                      }`}
                    >
                      {customer.consent}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="empty-state">
              <Users size={36} style={{ opacity: 0.5 }} />
              <h3>No customers registered</h3>
              <p>
                Customer profiles will appear after secure registration.
              </p>
            </div>
          )}
        </div>
      </section>

      <p className="page-subtitle" style={{ marginTop: 18 }}>
        Customer information will be stored securely with organization-level access controls.
      </p>
    </div>
  );
}
