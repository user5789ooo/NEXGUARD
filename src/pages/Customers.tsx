
import {
  Users,
  Search,
  UserPlus,
  Smartphone,
  Mail,
  RefreshCw,
  X,
  Save,
  Trash2
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

type Customer = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  created_at: string;
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const loadCustomers = useCallback(async () => {
    if (!supabase) {
      setError("Supabase is not configured. Check Netlify environment variables.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("customers")
      .select("id, full_name, phone, email, created_at")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setCustomers([]);
    } else {
      setCustomers((data ?? []) as Customer[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  const handleAddCustomer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2 || cleanPhone.length < 5) {
      setError("Enter a valid customer name and phone number.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setError("Please log in again before adding a customer.");
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("customers")
      .insert({
        owner_id: userData.user.id,
        full_name: cleanName,
        phone: cleanPhone,
        email: cleanEmail || null
      });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    setFullName("");
    setPhone("");
    setEmail("");
    setShowForm(false);
    setSuccess("Customer added successfully.");

    await loadCustomers();
    setSaving(false);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!supabase || deletingId) return;

    const confirmed = window.confirm(
      `PERMANENT DELETE: ${customer.full_name}

This permanently removes this customer record, linked devices, telemetry, permission history and pairing records.

This action cannot be undone.`
    );

    if (!confirmed) return;

    const typed = window.prompt(
      'Type PERMANENTLY DELETE to confirm.'
    );

    if (typed !== "PERMANENTLY DELETE") {
      setError("Deletion cancelled. Confirmation did not match.");
      return;
    }

    setDeletingId(customer.id);
    setError("");
    setSuccess("");

    const { data, error: deleteError } =
      await supabase.functions.invoke("delete-customer", {
        body: {
          customer_id: customer.id,
          confirmation: "DELETE",
          confirm_name: "PERMANENTLY DELETE"
        }
      });

    if (deleteError || !data?.success) {
      setError(
        data?.error ||
        deleteError?.message ||
        "Customer deletion failed."
      );
      setDeletingId(null);
      return;
    }

    setSuccess(
      `Customer permanently deleted. ${data.deleted_devices ?? 0} linked device(s) removed.` +
      (data.deleted_auth_account
        ? " Linked login account deleted."
        : " No linked login account was deleted.") +
      (data.warning ? ` Warning: ${data.warning}` : "")
    );

    await loadCustomers();
    setDeletingId(null);
  };

  const filteredCustomers = customers.filter((customer) =>
    `${customer.full_name} ${customer.email ?? ""} ${customer.phone}`
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

        <button className="btn" onClick={() => setShowForm(true)}>
          <UserPlus size={17} />
          Add Customer
        </button>
      </div>

      {error && (
        <div className="panel" style={{ marginBottom: 16, color: "#ff7777" }}>
          {error}
        </div>
      )}

      {success && (
        <div className="panel" style={{ marginBottom: 16, color: "#36d399" }}>
          {success}
        </div>
      )}

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
            <h3>Register New Customer</h3>

            <button
              type="button"
              className="btn"
              onClick={() => setShowForm(false)}
              style={{ padding: "8px 12px" }}
            >
              <X size={17} />
            </button>
          </div>

          <form onSubmit={handleAddCustomer}>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label>Full Name *</label>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter customer name"
                  minLength={2}
                  maxLength={120}
                  required
                />
              </div>

              <div>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter phone number"
                  minLength={5}
                  maxLength={25}
                  required
                />
              </div>

              <div>
                <label>Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter email address"
                  maxLength={254}
                />
              </div>

              <button className="btn" type="submit" disabled={saving}>
                <Save size={17} />
                {saving ? "Saving..." : "Save Customer"}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="stat-grid">
        <div className="stat-card">
          <Users color="#8294ff" size={23} />
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{customers.length}</div>
        </div>

        <div className="stat-card">
          <Smartphone color="#29c5d8" size={23} />
          <div className="stat-label">Linked Devices</div>
          <div className="stat-value">0</div>
        </div>

        <div className="stat-card">
          <Mail color="#36d399" size={23} />
          <div className="stat-label">Email Records</div>
          <div className="stat-value">
            {customers.filter((customer) => customer.email).length}
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
              Customer records stored in the NEXGUARD database.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customers..."
                style={{ paddingLeft: 38 }}
              />
            </div>

            <button
              className="btn"
              onClick={() => void loadCustomers()}
              disabled={loading}
              title="Refresh customers"
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
                <th>CUSTOMER</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>DEVICES</th>
                <th>REGISTERED</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <strong>{customer.full_name}</strong>
                    <div className="page-subtitle">
                      {customer.id.slice(0, 8)}
                    </div>
                  </td>

                  <td>{customer.email || "—"}</td>
                  <td>{customer.phone}</td>
                  <td>0</td>

                  <td>
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => void handleDeleteCustomer(customer)}
                      disabled={deletingId !== null}
                      title="Permanently delete customer"
                      style={{
                        padding: "8px 10px",
                        background: "#7f1d1d",
                        borderColor: "#991b1b"
                      }}
                    >
                      <Trash2 size={16} />
                      {deletingId === customer.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="empty-state">
              Loading customers...
            </div>
          )}

          {!loading && filteredCustomers.length === 0 && (
            <div className="empty-state">
              <Users size={36} style={{ opacity: 0.5 }} />

              <h3>
                {search
                  ? "No matching customers"
                  : "No customers registered"}
              </h3>

              <p>
                {search
                  ? "Try another name, email or phone number."
                  : "Select Add Customer to register your first customer."}
              </p>
            </div>
          )}
        </div>
      </section>

      <p className="page-subtitle" style={{ marginTop: 18 }}>
        Customer records are protected by Supabase Row Level Security.
      </p>
    </div>
  );
}
