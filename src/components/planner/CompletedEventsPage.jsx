import { useState, useEffect } from "react";
import HttpService from "../services/httpService";
import { getEventImage } from "../services/eventImageService";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./CompletedEventsPage.css";

const TYPE_ICON = { EQUIPMENT: "🔧", STAFF: "👤", VENUE: "🏛️" };

export default function CompletedEventsPage() {
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    HttpService.get("/api/planner/completed-events")
      .then((res) => setEvents(res.data))
      .catch(() => setError("Failed to load completed events."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dt) =>
    new Date(dt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const formatTime = (dt) =>
    new Date(dt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="cep-page">
      <Navbar />
      <main className="cep-main">

        {/* ── Header ── */}
        <div className="cep-header">
          <div className="cep-header-left">
            <p className="cep-eyebrow">✅ Archive</p>
            <h1 className="cep-title">Completed Events</h1>
            <p className="cep-subtitle">A record of all successfully delivered events</p>
          </div>
          <div className="cep-badge-total">
            <span className="cep-badge-num">{events.length}</span>
            <span className="cep-badge-label">Events Delivered</span>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="cep-search-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search by event name or location..."
            className="cep-search"
          />
        </div>

        {/* ── States ── */}
        {loading && (
          <div className="cep-center-box">
            <div className="cep-spinner" />
            <p className="cep-loading-text">Loading completed events...</p>
          </div>
        )}
        {error && <div className="cep-error-box">⚠️ {error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="cep-empty-box">
            <span className="cep-empty-icon">🗂️</span>
            <p>No completed events found.</p>
          </div>
        )}

        {/* ── Square Grid ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="cep-grid">
            {filtered.map((event) => (
              <div key={event.eventId} className="cep-card" onClick={() => setSelected(event)}>

                {/* Square Image */}
                <div className="cep-card-banner">
                  <img src={getEventImage(event.title)} alt={event.title} className="cep-banner-img" />
                  <div className="cep-banner-overlay" />
                  <div className="cep-checkmark">✓</div>
                  <div className="cep-banner-date">{formatDate(event.dateTime)}</div>
                </div>

                {/* Card Info */}
                <div className="cep-card-body">
                  <h3 className="cep-card-title">{event.title}</h3>
                  <p className="cep-card-location">📍 {event.location}</p>
                  <p className="cep-card-desc">{event.description}</p>
                  <div className="cep-card-footer">
                    <span className="cep-resource-count">
                      {event.allocations?.length || 0} resources
                    </span>
                    <span className="cep-view-btn">View Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="cep-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="cep-modal" onClick={(e) => e.stopPropagation()}>

            {/* Modal Image */}
            <div className="cep-modal-banner">
              <img src={getEventImage(selected.title)} alt={selected.title} className="cep-modal-img" />
              <div className="cep-modal-overlay" />
              <button className="cep-modal-close" onClick={() => setSelected(null)}>✕</button>
              <div className="cep-modal-banner-content">
                <span className="cep-modal-badge">✅ Completed</span>
                <h2 className="cep-modal-title">{selected.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="cep-modal-body">
              <p className="cep-modal-desc">{selected.description}</p>

              <div className="cep-modal-info-grid">
                {[
                  { icon: "📅", label: "Date",     value: formatDate(selected.dateTime) },
                  { icon: "🕐", label: "Time",     value: formatTime(selected.dateTime) },
                  { icon: "📍", label: "Location", value: selected.location },
                  { icon: "🏛️", label: "Setup",    value: selected.setupStatus?.replace("_", " ") },
                ].map((item) => (
                  <div key={item.label} className="cep-modal-info-item">
                    <span className="cep-modal-info-icon">{item.icon}</span>
                    <div>
                      <div className="cep-modal-info-label">{item.label}</div>
                      <div className="cep-modal-info-value">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resources */}
              {selected.allocations?.length > 0 && (
                <div className="cep-modal-resources">
                  <p className="cep-modal-section-title">Resources Used</p>
                  <div className="cep-modal-resource-grid">
                    {selected.allocations.map((a) => (
                      <div key={a.allocationId} className="cep-modal-resource-item">
                        <span>{TYPE_ICON[a.resource?.type] || "📦"}</span>
                        <div>
                          <div className="cep-modal-resource-name">{a.resource?.name}</div>
                          <div className="cep-modal-resource-type">{a.resource?.type}</div>
                        </div>
                        <span className="cep-modal-resource-qty">×{a.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
