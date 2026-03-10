import { useState } from "react";
import AuthService from "../services/authService";
import "./RegistrationPage.css";

const ROLES = [
  { value: "PLANNER", label: "Event Planner", icon: "📋", desc: "Create and manage events, allocate resources" },
  { value: "STAFF", label: "Staff", icon: "🏟️", desc: "Handle venue setup and event operations" },
  { value: "CLIENT", label: "Client", icon: "👥", desc: "View and track your event bookings" },
];

export default function RegistrationPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  };

  const validate = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword || !form.role)
      return "All fields are required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError(null);
    try {
      await AuthService.register({ username: form.username, email: form.email, password: form.password, role: form.role });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-container">
        <div className="reg-header">
          <div className="reg-logo">
            <span><img src="/src/assets/eventhublogo.jpg" /></span>
            <span className="reg-logo-text">EventHub</span></div>
        </div>

        {!success ? (
          <div className="reg-card">
            <div className="reg-card-header">
              <h1 className="reg-title">Create your account</h1>
              <p className="reg-subtitle">Join EventHub and get started</p>
            </div>

            <div className="reg-field-group">
              <label className="reg-label">I am a... *</label>
              <div className="reg-role-grid">
                {ROLES.map((r) => (
                  <button key={r.value}
                    onClick={() => { setForm((f) => ({ ...f, role: r.value })); setError(null); }}
                    className={`reg-role-btn${form.role === r.value ? " active" : ""}`}>
                    <span className="reg-role-icon">{r.icon}</span>
                    <span className="reg-role-label">{r.label}</span>
                    <span className="reg-role-desc">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="reg-divider" />

            <div className="reg-two-col">
              <div className="reg-field-group">
                <label className="reg-label">Username *</label>
                <input name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" className="reg-input" />
              </div>
              <div className="reg-field-group">
                <label className="reg-label">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="reg-input" />
              </div>
            </div>

            <div className="reg-two-col">
              <div className="reg-field-group">
                <label className="reg-label">Password *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="reg-input" />
              </div>
              <div className="reg-field-group">
                <label className="reg-label">Confirm Password *</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" className="reg-input" />
              </div>
            </div>

            {error && <div className="reg-error"><span>⚠️</span> {error}</div>}

            <button onClick={handleRegister} disabled={loading} className={`reg-submit-btn${loading ? " loading" : ""}`}>
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="reg-login-link">Already have an account? <a href="/login" className="reg-link">Sign in</a></p>
          </div>
        ) : (
          <div className="reg-success-card">
            <div className="reg-success-icon">🎉</div>
            <h2 className="reg-success-title">Account Created!</h2>
            <p className="reg-success-msg">
              Welcome to EventHub, <strong>{form.username}</strong>!<br />
              Your <strong>{ROLES.find(r => r.value === form.role)?.label}</strong> account is ready.
            </p>
            <a href="/login" className="reg-go-login-btn">Go to Sign In →</a>
          </div>
        )}
      </div>
    </div>
  );
}
