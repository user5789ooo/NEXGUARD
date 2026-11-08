
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield
} from "lucide-react";
import { signIn } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page fade-in">
      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div className="brand-mark" style={{
            width: 58,
            height: 58,
            margin: "0 auto 17px"
          }}>
            <ShieldCheck size={31} />
          </div>

          <h1 style={{ fontSize: 25, letterSpacing: 2 }}>
            NEXGUARD
          </h1>

          <p className="page-subtitle">
            Secure Device Management Platform
          </p>
        </div>

        <h2 style={{ fontSize: 21, marginBottom: 7 }}>
          Welcome Back
        </h2>

        <p className="page-subtitle">
          Sign in to access your secure workspace.
        </p>

        <form onSubmit={handleLogin}>
          <label>
            <span className="stat-label">Email Address</span>

            <div style={{ position: "relative", marginTop: 8 }}>
              <Mail size={17} style={{
                position: "absolute",
                left: 13,
                top: 14,
                color: "#8c9ab3"
              }} />

              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={{ paddingLeft: 42 }}
                required
              />
            </div>
          </label>

          <label style={{ display: "block", marginTop: 20 }}>
            <span className="stat-label">Password</span>

            <div style={{ position: "relative", marginTop: 8 }}>
              <Lock size={17} style={{
                position: "absolute",
                left: 13,
                top: 14,
                color: "#8c9ab3"
              }} />

              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ paddingLeft: 42, paddingRight: 43 }}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                style={{
                  position: "absolute",
                  right: 12,
                  top: 11,
                  border: 0,
                  background: "transparent",
                  color: "#8c9ab3"
                }}
              >
                {showPassword
                  ? <EyeOff size={19} />
                  : <Eye size={19} />}
              </button>
            </div>
          </label>

          {error && (
            <div role="alert" style={{
              marginTop: 18,
              padding: 12,
              borderRadius: 9,
              color: "#fb7185",
              background: "rgba(251,113,133,0.1)",
              fontSize: 12
            }}>
              {error}
            </div>
          )}

          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 25,
              padding: 14
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight size={17} />
          </button>
        </form>

        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          marginTop: 28,
          color: "#8c9ab3",
          fontSize: 11
        }}>
          <Shield size={15} color="#36d399" />
          Secure authentication · Protected access
        </div>

        <p style={{
          textAlign: "center",
          color: "#68758e",
          fontSize: 10,
          marginTop: 24
        }}>
          © {new Date().getFullYear()} NEXGUARD. All rights reserved.
        </p>
      </div>
    </div>
  );
          }
