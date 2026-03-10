import { useState } from "react";
import AuthService from "../services/authService";
import "./LoginPage.css";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await AuthService.login(form);
      window.location.href = AuthService.getDashboardPath();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-overlay" />
        <div className="login-left-content">
          <div className="login-logo">
            <span><img src="/src/assets/eventhublogo.jpg" />
            </span>
            <span className="login-logo-name">EventHub</span>
          </div>
          <h2 className="login-tagline">
            Manage events.<br />Allocate resources.<br />Deliver excellence.
          </h2>
          <div className="login-role-list">
            {[
              { icon: "📋", role: "Planners", desc: "Create & manage events" },
              { icon: "🏟️", role: "Staff", desc: "Handle venue setup" },
              { icon: "👥", role: "Clients", desc: "Track your bookings" },
            ].map((r) => (
              <div key={r.role} className="login-role-item">
                <span className="login-role-icon">{r.icon}</span>
                <div>
                  <div className="login-role-title">{r.role}</div>
                  <div className="login-role-desc">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-box">
          <div className="login-form-header">
            <h1 className="login-form-title">Welcome back</h1>
            <p className="login-form-subtitle">Sign in to your EventHub account</p>
          </div>

          <div className="login-field-group">
            <label className="login-label">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter your username"
              className="login-input"
              autoComplete="username"
            />
          </div>

          <div className="login-field-group">
            <label className="login-label">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter your password"
              className="login-input"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`login-submit-btn${loading ? " loading" : ""}`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="login-register-link">
            Don't have an account?{" "}
            <a href="/register" className="login-link">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
