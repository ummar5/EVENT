import { useState, useEffect } from "react";
import HttpService from "../services/httpService";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./StaffDirectoryPage.css";

const MOCK_STAFF = [
  { id: 1, name: "Balasubramanyam",     role: "Event Coordinator",  email: "balu@eventhub.com",  phone: "+65 9123 4567", status: "AVAILABLE",    avatar: "JR", dept: "Operations",  events: 12, rating: 4.9 },
  { id: 2, name: "Gouse",    role: "AV Technician",      email: "gouse@eventhub.com",  phone: "+65 9234 5678", status: "ON_DUTY",      avatar: "MS", dept: "Technical",   events: 8,  rating: 4.7 },
  { id: 3, name: "Thiru",     role: "Logistics Manager",  email: "thiru@eventhub.com", phone: "+65 9345 6789", status: "AVAILABLE",    avatar: "PN", dept: "Logistics",   events: 15, rating: 4.8 },
  { id: 4, name: "Umar",     role: "Security Lead",      email: "umar@eventhub.com",phone: "+65 9456 7890", status: "OFF_DUTY",     avatar: "CT", dept: "Security",    events: 6,  rating: 4.5 },
  { id: 5, name: "Vamsi",    role: "Catering Supervisor",email: "vamsi@eventhub.com", phone: "+65 9567 8901", status: "AVAILABLE",    avatar: "AM", dept: "Catering",    events: 10, rating: 4.6 },
  { id: 6, name: "Janardhan",      role: "Stage Manager",      email: "jana@eventhub.com", phone: "+65 9678 9012", status: "ON_DUTY",      avatar: "DL", dept: "Operations",  events: 18, rating: 4.0 },
];

const STATUS_META = {
  AVAILABLE: { label: "Available", color: "#0d9488", bg: "#f0fdfa" },
  ON_DUTY:   { label: "On Duty",   color: "#1e40af", bg: "#eff6ff" },
  OFF_DUTY:  { label: "Off Duty",  color: "#6b7280", bg: "#f3f4f6" },
};

const DEPT_COLORS = {
  Operations: "#7c3aed", Technical: "#0891b2", Logistics: "#0d9488",
  Security: "#dc2626", Catering: "#d97706",
};

export default function StaffDirectoryPage() {
  const [staff, setStaff]       = useState(MOCK_STAFF);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("ALL");
  const [selected, setSelected] = useState(null);

  const filtered = staff.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.dept.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || s.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total:     staff.length,
    available: staff.filter((s) => s.status === "AVAILABLE").length,
    onDuty:    staff.filter((s) => s.status === "ON_DUTY").length,
  };

  return (
    <div className="sdp-page">
      <Navbar />
      <main className="sdp-main">

        {/* Header */}
        <div className="sdp-header">
          <div>
            <p className="sdp-eyebrow">👥 Team</p>
            <h1 className="sdp-title">Staff Directory</h1>
            <p className="sdp-subtitle">View and manage your event team members</p>
          </div>
          <div className="sdp-stats-row">
            {[
              { label: "Total Staff", value: stats.total,     color: "#1e3a8a" },
              { label: "Available",   value: stats.available, color: "#0d9488" },
              { label: "On Duty",     value: stats.onDuty,    color: "#1e40af" },
            ].map((s) => (
              <div key={s.label} className="sdp-stat">
                <span className="sdp-stat-num" style={{ color: s.color }}>{s.value}</span>
                <span className="sdp-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="sdp-filter-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search by name, role or department..." className="sdp-search" />
          <div className="sdp-filters">
            {["ALL", "AVAILABLE", "ON_DUTY", "OFF_DUTY"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`sdp-filter-btn${filter === f ? " active" : ""}`}>
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="sdp-grid">
          {filtered.map((member) => {
            const status = STATUS_META[member.status];
            const deptColor = DEPT_COLORS[member.dept] || "#888";
            return (
              <div key={member.id} className="sdp-card" onClick={() => setSelected(member)}>
                <div className="sdp-card-top">
                  <div className="sdp-avatar" style={{ background: `linear-gradient(135deg, ${deptColor}22, ${deptColor}44)`, color: deptColor }}>
                    {member.avatar}
                  </div>
                  <span className="sdp-status-badge" style={{ background: status.bg, color: status.color }}>
                    <span className="sdp-dot" style={{ background: status.color }} /> {status.label}
                  </span>
                </div>
                <h3 className="sdp-card-name">{member.name}</h3>
                <p className="sdp-card-role">{member.role}</p>
                <span className="sdp-dept-tag" style={{ background: `${deptColor}18`, color: deptColor }}>{member.dept}</span>
                <div className="sdp-card-stats">
                  <div className="sdp-card-stat">
                    <span className="sdp-card-stat-num">{member.events}</span>
                    <span className="sdp-card-stat-label">Events</span>
                  </div>
                  <div className="sdp-card-divider" />
                  <div className="sdp-card-stat">
                    <span className="sdp-card-stat-num">⭐ {member.rating}</span>
                    <span className="sdp-card-stat-label">Rating</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Detail Modal */}
      {selected && (
        <div className="sdp-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="sdp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sdp-modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="sdp-modal-top" style={{ background: `linear-gradient(135deg, ${DEPT_COLORS[selected.dept]}22, ${DEPT_COLORS[selected.dept]}44)` }}>
              <div className="sdp-modal-avatar" style={{ background: `linear-gradient(135deg, ${DEPT_COLORS[selected.dept]}, ${DEPT_COLORS[selected.dept]}bb)` }}>
                {selected.avatar}
              </div>
              <h2 className="sdp-modal-name">{selected.name}</h2>
              <p className="sdp-modal-role">{selected.role}</p>
              <span className="sdp-modal-dept" style={{ background: `${DEPT_COLORS[selected.dept]}22`, color: DEPT_COLORS[selected.dept] }}>{selected.dept}</span>
            </div>
            <div className="sdp-modal-body">
              {[
                { icon: "📧", label: "Email",  value: selected.email },
                { icon: "📞", label: "Phone",  value: selected.phone },
                { icon: "📋", label: "Events", value: `${selected.events} events completed` },
                { icon: "⭐", label: "Rating", value: `${selected.rating} / 5.0` },
              ].map((item) => (
                <div key={item.label} className="sdp-modal-row">
                  <span className="sdp-modal-icon">{item.icon}</span>
                  <div>
                    <div className="sdp-modal-label">{item.label}</div>
                    <div className="sdp-modal-value">{item.value}</div>
                  </div>
                </div>
              ))}
              <div className="sdp-modal-status-row">
                <span className="sdp-modal-status-badge"
                  style={{ background: STATUS_META[selected.status].bg, color: STATUS_META[selected.status].color }}>
                  <span className="sdp-dot" style={{ background: STATUS_META[selected.status].color }} />
                  {STATUS_META[selected.status].label}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
