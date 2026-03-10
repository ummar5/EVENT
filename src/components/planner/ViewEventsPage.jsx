import { useState, useEffect } from "react";
import HttpService from "../services/httpService";
import { getEventImage } from "../services/eventImageService";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./ViewEventsPage.css";

const TYPE_ICON = { EQUIPMENT: "🔧", STAFF: "👤", VENUE: "🏛️" };

export default function ViewEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    HttpService.get("/api/planner/events")
      .then((res) => setEvents(res.data))
      .catch(() => setError("Failed to load events."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: events.length,
    planned: events.filter((e) => e.status === "PLANNED").length,
    ongoing: events.filter((e) => e.status === "ONGOING").length,
    completed: events.filter((e) => e.status === "COMPLETED").length,
  };

  const formatDate = (dt) => new Date(dt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formatTime = (dt) => new Date(dt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="vep-page">
      <Navbar />
      <main className="vep-main">
        <div className="vep-page-title">
          <div>
            <h1 className="vep-title">Event Dashboard</h1>
            <p className="vep-subtitle">Manage all your events and resource allocations</p>
          </div>
          <a href="/planner/create-event" className="vep-create-btn">+ New Event</a>
        </div>

        {/* Stats */}
        <div className="vep-stats-row">
          {[
            { label: "Total Events", value: stats.total, cls: "total" },
            { label: "Planned", value: stats.planned, cls: "planned" },
            { label: "Ongoing", value: stats.ongoing, cls: "ongoing" },
            { label: "Completed", value: stats.completed, cls: "completed" },
          ].map((s) => (
            <div key={s.label} className="vep-stat-card">
              <div className={`vep-stat-value ${s.cls}`}>{s.value}</div>
              <div className="vep-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="vep-filter-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search events or location..." className="vep-search" />
          <div className="vep-status-filters">
            {["ALL", "PLANNED", "ONGOING", "COMPLETED"].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`vep-filter-btn${filterStatus === s ? " active" : ""}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="vep-quick-links">
          <a href="/planner/add-resource" className="vep-quick-link">➕ Add Resource</a>
          <a href="/planner/allocate" className="vep-quick-link">🔗 Allocate Resources</a>
        </div>

        {loading && (
          <div className="vep-center-box">
            <div className="vep-spinner" />
            <p className="vep-loading-text">Loading events...</p>
          </div>
        )}
        {error && <div className="vep-error-box">⚠️ {error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="vep-empty-box">
            <span className="vep-empty-icon">📭</span>
            <p>No events found. <a href="/planner/create-event" className="vep-link">Create one →</a></p>
          </div>
        )}

        {!loading && !error && (
          <div className="vep-event-list">
            {filtered.map((event) => {
              const isOpen = expandedId === event.eventId;
              const imgUrl = getEventImage(event.title);
              return (
                <div key={event.eventId} className="vep-event-card">

                  {/* ── Event Banner Image ── */}
                  <div className="vep-event-banner">
                    <img src={imgUrl} alt={event.title} className="vep-banner-img" />
                    <div className="vep-banner-overlay" />
                    <span className={`vep-banner-status ${event.status?.toLowerCase()}`}>
                      <span className="vep-dot" /> {event.status}
                    </span>
                  </div>

                  <div className="vep-event-header" onClick={() => setExpandedId(isOpen ? null : event.eventId)}>
                    <div className="vep-event-left">
                      <div className="vep-event-meta">
                        <span className="vep-event-date">{formatDate(event.dateTime)} · {formatTime(event.dateTime)}</span>
                      </div>
                      <h3 className="vep-event-title">{event.title}</h3>
                      <div className="vep-event-location">📍 {event.location}</div>
                    </div>
                    <div className="vep-event-right">
                      <div className="vep-allocation-count">
                        <span className="vep-allocation-num">{event.allocations?.length || 0}</span>
                        <span className="vep-allocation-text">resources</span>
                      </div>
                      <span className="vep-chevron">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="vep-allocations">
                      <p className="vep-allocations-title">Allocated Resources</p>
                      {!event.allocations || event.allocations.length === 0 ? (
                        <p className="vep-no-alloc">No resources allocated yet. <a href="/planner/allocate" className="vep-link">Allocate now →</a></p>
                      ) : (
                        <div className="vep-alloc-grid">
                          {event.allocations.map((a) => (
                            <div key={a.allocationId} className="vep-alloc-item">
                              <span>{TYPE_ICON[a.resource?.type] || "📦"}</span>
                              <div>
                                <div className="vep-alloc-name">{a.resource?.name}</div>
                                <div className="vep-alloc-type">{a.resource?.type}</div>
                              </div>
                              <span className="vep-alloc-qty">×{a.quantity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="vep-card-actions">
                        <a href={`/planner/allocate?eventId=${event.eventId}`} className="vep-action-link">+ Add Resource</a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}