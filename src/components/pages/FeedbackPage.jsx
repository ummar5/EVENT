import { useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./FeedbackPage.css";

const CATEGORIES = ["Event Planning", "Staff Performance", "Resource Management", "Platform Experience", "Other"];

export default function FeedbackPage() {
  const [form, setForm]       = useState({ name: "", email: "", category: "", rating: 0, message: "" });
  const [hover, setHover]     = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.rating || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  if (submitted) return (
    <div className="fbp-page">
      <Navbar />
      <main className="fbp-main">
        <div className="fbp-success">
          <div className="fbp-success-icon">🎉</div>
          <h2 className="fbp-success-title">Thank You!</h2>
          <p className="fbp-success-desc">Your feedback has been submitted. We truly appreciate you taking the time to share your thoughts — it helps us improve every event we deliver.</p>
          <button className="fbp-success-btn" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", category: "", rating: 0, message: "" }); }}>
            Submit Another
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="fbp-page">
      <Navbar />
      <main className="fbp-main">

        {/* Header */}
        <div className="fbp-header">
          <p className="fbp-eyebrow">💬 Feedback</p>
          <h1 className="fbp-title">Share Your Experience</h1>
          <p className="fbp-subtitle">Your feedback helps us deliver better events and improve our platform</p>
        </div>

        <div className="fbp-layout">
          {/* Form */}
          <div className="fbp-form-card">
            <div className="fbp-field-row">
              <div className="fbp-field">
                <label className="fbp-label">Your Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Reyes" className="fbp-input" />
              </div>
              <div className="fbp-field">
                <label className="fbp-label">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@email.com" className="fbp-input" />
              </div>
            </div>

            <div className="fbp-field">
              <label className="fbp-label">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="fbp-select">
                <option value="">Select a category...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="fbp-field">
              <label className="fbp-label">Overall Rating</label>
              <div className="fbp-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} className={`fbp-star${star <= (hover || form.rating) ? " filled" : ""}`}
                    onClick={() => setForm({ ...form, rating: star })}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}>★</button>
                ))}
                {(hover || form.rating) > 0 && (
                  <span className="fbp-star-label">{STAR_LABELS[hover || form.rating]}</span>
                )}
              </div>
            </div>

            <div className="fbp-field">
              <label className="fbp-label">Your Message</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="Tell us about your experience with EventHub..." rows={5} className="fbp-textarea" />
            </div>

            <button className={`fbp-submit-btn${loading ? " loading" : ""}`} onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback →"}
            </button>
          </div>

          {/* Side info */}
          <div className="fbp-side">
            <div className="fbp-side-card">
              <h3 className="fbp-side-title">Why Your Feedback Matters</h3>
              {[
                { icon: "📈", text: "Helps us improve our event planning process" },
                { icon: "👥", text: "Shapes how we train and support our staff" },
                { icon: "⚡", text: "Drives improvements to our platform features" },
                { icon: "🏆", text: "Directly impacts future event quality" },
              ].map((item) => (
                <div key={item.text} className="fbp-side-item">
                  <span className="fbp-side-icon">{item.icon}</span>
                  <span className="fbp-side-text">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="fbp-side-card fbp-rating-summary">
              <h3 className="fbp-side-title">Overall Rating</h3>
              <div className="fbp-rating-big">4.8</div>
              <div className="fbp-rating-stars">★★★★★</div>
              <p className="fbp-rating-count">Based on 248 reviews</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
