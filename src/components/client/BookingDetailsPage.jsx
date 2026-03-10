import { useState, useEffect } from "react";
import HttpService from "../services/httpService";
import { getEventImage } from "../services/eventImageService";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./BookingDetailsPage.css";

const LIFECYCLE = ["PLANNED", "ONGOING", "COMPLETED"];
const STATUS_META = {
  PLANNED:   { label: "Planned",   color: "#3b9de0", icon: "📋" },
  ONGOING:   { label: "Ongoing",   color: "#10b981", icon: "🟢" },
  COMPLETED: { label: "Completed", color: "#6b7280", icon: "✅" },
};
const TYPE_ICON = { EQUIPMENT: "🔧", STAFF: "👤", VENUE: "🏛️" };

export default function BookingDetailsPage() {
  const eventId = 1; // Replace with: const { eventId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    HttpService.get(`/api/client/booking-details/${eventId}`)
      .then((res) => setBooking(res.data))
      .catch(() => setError("Unable to load your booking details. Please contact support."))
      .finally(() => setLoading(false));
  }, [eventId]);

  const currentStep = LIFECYCLE.indexOf(booking?.status);
  const statusMeta = booking ? STATUS_META[booking.status] || STATUS_META.PLANNED : {};

  const formatDate = (dt) => new Date(dt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const formatTime = (dt) => new Date(dt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const groupedResources = booking?.allocatedResources?.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <div className="bdp-page">
      <Navbar />
      <main className="bdp-main">
        {loading && (
          <div className="bdp-center-box">
            <div className="bdp-spinner" />
            <p className="bdp-loading-text">Loading your booking...</p>
          </div>
        )}
        {error && (
          <div className="bdp-error-box">
            <span>⚠️</span>
            <div><strong>Something went wrong</strong><p>{error}</p></div>
          </div>
        )}

        {!loading && !error && booking && (
          <>
            {/* ── Hero Banner with Unsplash Image ── */}
            <div className="bdp-hero">
              <img src={getEventImage(booking.title)} alt={booking.title} className="bdp-hero-img" />
              <div className="bdp-hero-overlay" />
              <div className="bdp-hero-content">
                <p className="bdp-hero-eyebrow">Your Booking</p>
                <h1 className="bdp-hero-title">{booking.title}</h1>
                <span className={`bdp-status-badge ${booking.status?.toLowerCase()}`}>
                  {statusMeta.icon} {statusMeta.label}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="bdp-progress-card">
              <p className="bdp-progress-label">Event Progress</p>
              <div className="bdp-progress-track">
                {LIFECYCLE.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  const meta = STATUS_META[step];
                  return (
                    <div key={step} className="bdp-progress-step">
                      <div className={`bdp-progress-dot${done ? " done" : ""}${active ? " active" : ""}`}
                        style={done ? { background: meta.color, boxShadow: active ? `0 0 0 4px ${meta.color}33` : "none" } : {}}>
                        {done && <span className="bdp-check">✓</span>}
                      </div>
                      <span className={`bdp-step-label${done ? " done" : ""}`}>{meta.label}</span>
                      {i < LIFECYCLE.length - 1 && (
                        <div className="bdp-progress-line"
                          style={{ background: i < currentStep ? STATUS_META[LIFECYCLE[i]].color : "#e5e5e3" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            <div className="bdp-grid">
              <div className="bdp-card">
                <h2 className="bdp-card-title">Event Information</h2>
                <p className="bdp-desc">{booking.description}</p>
                <div className="bdp-info-list">
                  {[
                    { icon: "📅", label: "Date",        value: formatDate(booking.dateTime) },
                    { icon: "🕐", label: "Time",        value: formatTime(booking.dateTime) },
                    { icon: "📍", label: "Location",    value: booking.location },
                    { icon: "🏛️", label: "Venue Setup", value: booking.setupStatus?.replace("_", " ") },
                  ].map((item) => (
                    <div key={item.label} className="bdp-info-row">
                      <span className="bdp-info-icon">{item.icon}</span>
                      <div>
                        <div className="bdp-info-label">{item.label}</div>
                        <div className="bdp-info-value">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bdp-card">
                <h2 className="bdp-card-title">Allocated Resources</h2>
                <p className="bdp-card-subtitle">{booking.allocatedResources?.length} resources assigned to your event</p>
                {groupedResources && Object.entries(groupedResources).map(([type, items]) => (
                  <div key={type} className="bdp-resource-group">
                    <div className="bdp-resource-group-header">
                      <span>{TYPE_ICON[type]}</span>
                      <span className={`bdp-resource-group-label ${type.toLowerCase()}`}>{type}</span>
                      <span className={`bdp-resource-group-count ${type.toLowerCase()}`}>{items.length}</span>
                    </div>
                    {items.map((r) => (
                      <div key={r.resourceId} className="bdp-resource-item">
                        <div className="bdp-resource-name">{r.name}</div>
                        <div className={`bdp-resource-qty ${type.toLowerCase()}`}>×{r.quantity}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="bdp-footer-note">
              <span>ℹ️</span>
              <p>This is a read-only view of your booking. For changes or inquiries, please contact your event planner directly.</p>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}