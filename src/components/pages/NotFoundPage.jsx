import { Link } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="nf-page">
      <Navbar />
      <main className="nf-main">
        <div className="nf-box">
          <div className="nf-code">404</div>
          <h1 className="nf-title">Page Not Found</h1>
          <p className="nf-msg">The page you are looking for could not be found.</p>
          <Link to="/" className="nf-btn">Go to Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
