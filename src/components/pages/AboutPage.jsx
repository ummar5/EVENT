import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./AboutPage.css";

const TEAM = [
  { name: "Balasubramanyam",  role: "Founder & CEO",       avatar: "AM", color: "#1e40af" },
  { name: "Gouse",   role: "Head of Operations",  avatar: "SC", color: "#0891b2" },
  { name: "Thiru",   role: "Lead Engineer",       avatar: "RK", color: "#0d9488" },
  { name: "Umar",   role: "UX Designer",         avatar: "NP", color: "#7c3aed" },
];

const VALUES = [
  { icon: "🎯", title: "Precision",   desc: "Every detail matters. We plan events with surgical accuracy and zero margin for error." },
  { icon: "🤝", title: "Partnership", desc: "We work alongside our clients as true partners, not just vendors." },
  { icon: "⚡", title: "Efficiency",  desc: "Smart resource allocation means every dollar and hour is used to maximum effect." },
  { icon: "🌟", title: "Excellence",  desc: "We don't settle for good. Every event we manage is a benchmark for the industry." },
];

const MILESTONES = [
  { year: "2020", title: "Founded",            desc: "EventHub launched with a mission to modernize event management." },
  { year: "2021", title: "100 Events",         desc: "Crossed our first major milestone with 100 successfully delivered events." },
  { year: "2023", title: "Regional Expansion", desc: "Expanded operations across Southeast Asia with 500+ events managed." },
  { year: "2025", title: "Platform Launch",    desc: "Launched our full digital platform for planners, staff and clients." },
];

export default function AboutPage() {
  return (
    <div className="abp-page">
      <Navbar />
      <main className="abp-main">

        {/* Hero */}
        <div className="abp-hero">
          <p className="abp-eyebrow">About Us</p>
          <h1 className="abp-hero-title">We Make Events <span className="abp-highlight">Unforgettable</span></h1>
          <p className="abp-hero-desc">EventHub is Southeast Asia's premier event management platform — connecting planners, staff and clients to deliver seamless, world-class experiences.</p>
        </div>

        {/* Stats */}
        <div className="abp-stats-row">
          {[
            { value: "500+", label: "Events Delivered" },
            { value: "98%",  label: "Client Satisfaction" },
            { value: "50+",  label: "Team Members" },
            { value: "5",    label: "Years of Excellence" },
          ].map((s) => (
            <div key={s.label} className="abp-stat-card">
              <div className="abp-stat-value">{s.value}</div>
              <div className="abp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="abp-section">
          <div className="abp-mission-card">
            <div className="abp-mission-left">
              <p className="abp-section-eyebrow">Our Mission</p>
              <h2 className="abp-section-title">Turning Vision Into Reality</h2>
              <p className="abp-mission-text">We believe every event is an opportunity to create something extraordinary. Our platform brings together powerful tools, dedicated staff, and smart resource management to ensure every event is executed with excellence.</p>
              <p className="abp-mission-text">From the first planning session to the final handshake, EventHub is with you every step of the way.</p>
            </div>
            <div className="abp-mission-right">
              <div className="abp-mission-visual"><span className="abp-mission-icon">⚡</span></div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="abp-section">
          <p className="abp-section-eyebrow">Our Values</p>
          <h2 className="abp-section-title">What We Stand For</h2>
          <div className="abp-values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="abp-value-card">
                <span className="abp-value-icon">{v.icon}</span>
                <h3 className="abp-value-title">{v.title}</h3>
                <p className="abp-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="abp-section">
          <p className="abp-section-eyebrow">Our Journey</p>
          <h2 className="abp-section-title">How We Got Here</h2>
          <div className="abp-timeline">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`abp-timeline-item ${i % 2 === 0 ? "left" : "right"}`}>
                <div className="abp-timeline-card">
                  <span className="abp-timeline-year">{m.year}</span>
                  <h3 className="abp-timeline-title">{m.title}</h3>
                  <p className="abp-timeline-desc">{m.desc}</p>
                </div>
                <div className="abp-timeline-dot" />
              </div>
            ))}
            <div className="abp-timeline-line" />
          </div>
        </div>

        {/* Team */}
        <div className="abp-section">
          <p className="abp-section-eyebrow">Our Team</p>
          <h2 className="abp-section-title">The People Behind EventHub</h2>
          <div className="abp-team-grid">
            {TEAM.map((m) => (
              <div key={m.name} className="abp-team-card">
                <div className="abp-team-avatar" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}bb)` }}>{m.avatar}</div>
                <h3 className="abp-team-name">{m.name}</h3>
                <p className="abp-team-role">{m.role}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
