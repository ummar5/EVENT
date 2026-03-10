import { useState } from "react";
import HttpService from "../services/httpService";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./CreateEventForm.css";

export default function CreateEventForm() {
  const [form, setForm] = useState({ title: "", description: "", dateTime: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  };

  const validate = () => {
    if (!form.title.trim()) return "Event title is required.";
    if (!form.dateTime) return "Date and time are required.";
    if (!form.location.trim()) return "Location is required.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await HttpService.post("/api/planner/event", form);
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ title: "", description: "", dateTime: "", location: "" });
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="cef-page">
      <Navbar />
      <main className="cef-main">
        <a href="/planner/events" className="cef-back-link">← Back to Events</a>
        <div className="cef-card">
          {!success ? (
            <>
              <div className="cef-card-top">
                <div className="cef-icon-box">📅</div>
                <div>
                  <p className="cef-eyebrow">Planner</p>
                  <h1 className="cef-title">Create New Event</h1>
                  <p className="cef-subtitle">Fill in the details to schedule a new event.</p>
                </div>
              </div>
              <div className="cef-divider" />

              <div className="cef-field-group">
                <label className="cef-label">Event Title *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Annual Tech Summit 2025" className="cef-input" />
              </div>

              <div className="cef-field-group">
                <label className="cef-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Briefly describe the event..." rows={4} className="cef-textarea" />
              </div>

              <div className="cef-two-col">
                <div className="cef-field-group">
                  <label className="cef-label">Date & Time *</label>
                  <input name="dateTime" type="datetime-local" value={form.dateTime}
                    onChange={handleChange} className="cef-input" />
                </div>
                <div className="cef-field-group">
                  <label className="cef-label">Location *</label>
                  <input name="location" value={form.location} onChange={handleChange}
                    placeholder="e.g. Marina Bay Convention Centre" className="cef-input" />
                </div>
              </div>

              {error && <div className="cef-error"><span>⚠️</span> {error}</div>}

              <button onClick={handleSubmit} disabled={loading}
                className={`cef-btn${loading ? " loading" : ""}`}>
                {loading ? "Creating..." : "Create Event"}
              </button>
            </>
          ) : (
            <div className="cef-success-box">
              <div className="cef-success-icon">🎉</div>
              <h2 className="cef-success-title">Event Created!</h2>
              <p className="cef-success-msg"><strong>{form.title}</strong> has been successfully scheduled.</p>
              <div className="cef-success-actions">
                <a href="/planner/events" className="cef-btn-dark">View All Events</a>
                <button onClick={handleReset} className="cef-btn-outline">Create Another</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
