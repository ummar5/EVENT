import { useState } from "react";
import HttpService from "../services/httpService";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./AddResourceForm.css";

const RESOURCE_TYPES = [
  { value: "EQUIPMENT", label: "Equipment", icon: "🔧", desc: "Audio, lighting, displays" },
  { value: "STAFF", label: "Staff", icon: "👤", desc: "Coordinators, support staff" },
  { value: "VENUE", label: "Venue", icon: "🏛️", desc: "Halls, rooms, outdoor spaces" },
];

export default function AddResourceForm() {
  const [form, setForm] = useState({ name: "", type: "", availability: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!form.name.trim()) return "Resource name is required.";
    if (!form.type) return "Please select a resource type.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await HttpService.post("/api/planner/resource", form);
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to add resource.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ name: "", type: "", availability: true });
    setSuccess(false);
    setError(null);
  };

  const getPlaceholder = () => {
    if (form.type === "EQUIPMENT") return "e.g. Main Stage Audio System";
    if (form.type === "STAFF") return "e.g. Jane Reyes — Event Coordinator";
    if (form.type === "VENUE") return "e.g. Hall A — Grand Ballroom";
    return "Enter resource name";
  };

  return (
    <div className="arf-page">
      <Navbar />
      <main className="arf-main">
        <a href="/planner/events" className="arf-back-link">← Back to Dashboard</a>
        <div className="arf-card">
          {!success ? (
            <>
              <div className="arf-card-top">
                <div className="arf-icon-box">🗂️</div>
                <div>
                  <p className="arf-eyebrow">Resources</p>
                  <h1 className="arf-title">Add New Resource</h1>
                  <p className="arf-subtitle">Add staff, equipment, or a venue to the inventory.</p>
                </div>
              </div>
              <div className="arf-divider" />

              <div className="arf-field-group">
                <label className="arf-label">Resource Type *</label>
                <div className="arf-type-grid">
                  {RESOURCE_TYPES.map((t) => (
                    <button key={t.value}
                      onClick={() => { setForm((f) => ({ ...f, type: t.value })); setError(null); }}
                      className={`arf-type-btn${form.type === t.value ? " active" : ""}`}>
                      <span className="arf-type-icon">{t.icon}</span>
                      <span className="arf-type-label">{t.label}</span>
                      <span className="arf-type-desc">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="arf-field-group">
                <label className="arf-label">Resource Name *</label>
                <input name="name" value={form.name}
                  onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setError(null); }}
                  placeholder={getPlaceholder()} className="arf-input" />
              </div>

              <div className="arf-field-group">
                <label className="arf-label">Initial Availability</label>
                <div className="arf-toggle-row">
                  <button onClick={() => setForm((f) => ({ ...f, availability: true }))}
                    className={`arf-toggle-btn available${form.availability === true ? " active" : ""}`}>
                    ✅ Available
                  </button>
                  <button onClick={() => setForm((f) => ({ ...f, availability: false }))}
                    className={`arf-toggle-btn unavailable${form.availability === false ? " active" : ""}`}>
                    🔴 Unavailable
                  </button>
                </div>
              </div>

              {error && <div className="arf-error"><span>⚠️</span> {error}</div>}

              <button onClick={handleSubmit} disabled={loading}
                className={`arf-btn${loading ? " loading" : ""}`}>
                {loading ? "Adding..." : "Add Resource"}
              </button>
            </>
          ) : (
            <div className="arf-success-box">
              <div className="arf-success-icon">✅</div>
              <h2 className="arf-success-title">Resource Added!</h2>
              <p className="arf-success-msg">
                <strong>{form.name}</strong> has been added to the{" "}
                <strong>{RESOURCE_TYPES.find(t => t.value === form.type)?.label}</strong> inventory.
              </p>
              <div className="arf-success-actions">
                <a href="/planner/allocate" className="arf-btn-dark">Allocate Resources</a>
                <button onClick={handleReset} className="arf-btn-outline">Add Another</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
