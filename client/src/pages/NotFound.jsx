import { Link } from "react-router-dom";
import { Crown, ArrowLeft } from "lucide-react";
import SEO from "../components/SEO.jsx";

const NotFound = () => (
  <>
    <SEO title="Page Not Found" path="/404" />
    <section className="flex min-h-[70vh] flex-col items-center justify-center text-center px-6">
      <div className="badge-medallion h-20 w-20 text-gold-400">
        <Crown size={32} />
      </div>
      <h1 className="mt-8 font-display text-5xl font-black text-ivory sm:text-6xl">404</h1>
      <p className="mt-3 text-ivory/60">This page doesn&apos;t exist — but your next great project can.</p>
      <Link to="/" className="btn-gold mt-8">
        <ArrowLeft size={16} /> Back to Home
      </Link>
    </section>
  </>
);

export default NotFound;
