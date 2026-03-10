import { useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./ContactPage.css";

export default function ContactPage() {
  const [form, setForm]           = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="cop-page">
      <Navbar />
      <main className="cop-main">
        <div className="cop-success">
          <div className="cop-success-icon">✉️</div>
          <h2 className="cop-success-title">Message Sent!</h2>
          <p className="cop-success-desc">We've received your message and will get back to you within 24 hours.</p>
          <button className="cop-success-btn" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
            Send Another
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="cop-page">
      <Navbar />
      <main className="cop-main">

        {/* Header */}
        <div className="cop-header">
          <p className="cop-eyebrow">📬 Contact</p>
          <h1 className="cop-title">Get In Touch</h1>
          <p className="cop-subtitle">Have a question or need help? We're here for you 24/7.</p>
        </div>

        <div className="cop-layout">

          {/* Contact Info */}
          <div className="cop-info">
            {[
              { icon: "📍", title: "Office",    lines: ["Hyderabad, Telangana", "India 5646456"] },
              { icon: "📞", title: "Phone",     lines: ["+91 61239 4XXXX", "Mon–Fri, 9am–6pm SGT"] },
              { icon: "📧", title: "Email",     lines: ["help@eventhub.com", "support@eventhub.com"] },
              { icon: "⏰", title: "Hours",     lines: ["Monday – Friday: 9am – 6pm", "Saturday: 10am – 2pm"] },
            ].map((item) => (
              <div key={item.title} className="cop-info-card">
                <span className="cop-info-icon">{item.icon}</span>
                <div>
                  <div className="cop-info-title">{item.title}</div>
                  {item.lines.map((l) => <div key={l} className="cop-info-line">{l}</div>)}
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="cop-social-card">
              <p className="cop-social-title">Follow Us</p>
              <div className="cop-social-row">
                {["LinkedIn", "Twitter", "Instagram"].map((s) => (
                  <span key={s} className="cop-social-btn">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="cop-form-card">
            <h2 className="cop-form-title">Send Us a Message</h2>
            <div className="cop-field-row">
              <div className="cop-field">
                <label className="cop-label">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Reyes" className="cop-input" />
              </div>
              <div className="cop-field">
                <label className="cop-label">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@email.com" className="cop-input" />
              </div>
            </div>
            <div className="cop-field">
              <label className="cop-label">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help you?" className="cop-input" />
            </div>
            <div className="cop-field">
              <label className="cop-label">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="Tell us more about your enquiry..." rows={5} className="cop-textarea" />
            </div>
            <button className={`cop-submit-btn${loading ? " loading" : ""}`} onClick={handleSubmit} disabled={loading}>
              {loading ? "Sending..." : "Send Message →"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
