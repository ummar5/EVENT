import { useState, useEffect } from "react";
import HttpService from "../services/httpService";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./ResourceAllocatePage.css";

const TYPE_ICON = { EQUIPMENT: "🔧", STAFF: "👤", VENUE: "🏛️" };

export default function ResourceAllocatePage() {
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ eventId: "", resourceId: "", quantity: 1 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      HttpService.get("/api/planner/events"),
      HttpService.get("/api/planner/resources/available"),
    ])
      .then(([evRes, resRes]) => { setEvents(evRes.data); setResources(resRes.data); })
      .catch(() => setError("Failed to load data. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const selectedEvent = events.find((e) => String(e.eventId) === String(form.eventId));
  const selectedResource = resources.find((r) => String(r.resourceId) === String(form.resourceId));

  const validate = () => {
    if (!form.eventId) return "Please select an event.";
    if (!form.resourceId) return "Please select a resource.";
    if (!form.quantity || form.quantity < 1) return "Quantity must be at least 1.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSubmitting(true);
    setError(null);
    try {
      await HttpService.post("/api/planner/allocate-resources", {
        eventId: Number(form.eventId),
        resourceId: Number(form.resourceId),
        quantity: Number(form.quantity),
      });
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.message || "Allocation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ eventId: "", resourceId: "", quantity: 1 });
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="rap-page">
      <Navbar />
      <main className="rap-main">
        <a href="/planner/events" className="rap-back-link">← Back to Dashboard</a>
        <div className="rap-card">
          {loading ? (
            <div className="rap-center-box">
              <div className="rap-spinner" />
              <p className="rap-loading-text">Loading events and resources...</p>
            </div>
          ) : !success ? (
            <>
              <div className="rap-card-top">
                <div className="rap-icon-box">🔗</div>
                <div>
                  <p className="rap-eyebrow">Allocation</p>
                  <h1 className="rap-title">Allocate Resource to Event</h1>
                  <p className="rap-subtitle">Assign an available resource and specify the quantity.</p>
                </div>
              </div>
              <div className="rap-divider" />

              {/* Step 1 */}
              <div className="rap-field-group">
                <label className="rap-label">① Select Event *</label>
                <select value={form.eventId}
                  onChange={(e) => { setForm((f) => ({ ...f, eventId: e.target.value })); setError(null); }}
                  className="rap-select">
                  <option value="">-- Choose an event --</option>
                  {events.map((e) => (
                    <option key={e.eventId} value={e.eventId}>{e.title}</option>
                  ))}
                </select>
                {selectedEvent && (
                  <div className="rap-preview-box">
                    <span>📅</span>
                    <div>
                      <div className="rap-preview-title">{selectedEvent.title}</div>
                      <div className="rap-preview-sub">{selectedEvent.location} · {new Date(selectedEvent.dateTime).toLocaleDateString()}</div>
                    </div>
                    <span className={`rap-status-badge ${selectedEvent.status?.toLowerCase()}`}>{selectedEvent.status}</span>
                  </div>
                )}
              </div>

              {/* Step 2 */}
              <div className="rap-field-group">
                <label className="rap-label">② Select Resource *</label>
                {resources.length === 0 ? (
                  <div className="rap-empty-note">No available resources. <a href="/planner/add-resource" className="rap-link">Add one first →</a></div>
                ) : (
                  <div className="rap-resource-grid">
                    {resources.map((r) => (
                      <button key={r.resourceId}
                        onClick={() => { setForm((f) => ({ ...f, resourceId: r.resourceId })); setError(null); }}
                        className={`rap-resource-btn${String(form.resourceId) === String(r.resourceId) ? " active" : ""}`}>
                        <span className="rap-resource-icon">{TYPE_ICON[r.type] || "📦"}</span>
                        <span className="rap-resource-name">{r.name}</span>
                        <span className={`rap-type-pill ${r.type?.toLowerCase()}`}>{r.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className="rap-field-group">
                <label className="rap-label">③ Quantity *</label>
                <div className="rap-qty-row">
                  <button className="rap-qty-btn" onClick={() => setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}>−</button>
                  <input type="number" value={form.quantity} min={1}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
                    className="rap-qty-input" />
                  <button className="rap-qty-btn right" onClick={() => setForm((f) => ({ ...f, quantity: f.quantity + 1 }))}>+</button>
                </div>
              </div>

              {selectedEvent && selectedResource && (
                <div className="rap-summary-box">
                  <p className="rap-summary-label">Allocation Summary</p>
                  <p className="rap-summary-text">
                    Assign <strong>{form.quantity}×</strong> <strong>{selectedResource.name}</strong> to <strong>{selectedEvent.title}</strong>
                  </p>
                </div>
              )}

              {error && <div className="rap-error"><span>⚠️</span> {error}</div>}

              <button onClick={handleSubmit} disabled={submitting}
                className={`rap-btn${submitting ? " loading" : ""}`}>
                {submitting ? "Allocating..." : "Confirm Allocation"}
              </button>
            </>
          ) : (
            <div className="rap-success-box">
              <div className="rap-success-icon">🔗</div>
              <h2 className="rap-success-title">Resource Allocated!</h2>
              <p className="rap-success-msg">
                <strong>{form.quantity}× {selectedResource?.name}</strong> has been allocated to <strong>{selectedEvent?.title}</strong>.
              </p>
              <div className="rap-success-actions">
                <a href="/planner/events" className="rap-btn-dark">View Dashboard</a>
                <button onClick={handleReset} className="rap-btn-outline">Allocate Another</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
