import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import SEO from "../components/SEO.jsx";
import api from "../utils/api.js";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get("/testimonials")
      .then((res) => setTestimonials(res.data.testimonials || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Client Reviews"
        description="Read client reviews and experiences with Prince Digital Studio."
        path="/testimonials"
      />

      <section className="section pt-16">
        <div className="container-px mx-auto max-w-4xl text-center">
          <span className="eyebrow justify-center">Client Trust</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl lg:text-5xl">
            What Our <span className="gold-text">Clients Say</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-ivory/60">
            Read experiences shared by clients who have worked with Prince Digital Studio.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-px mx-auto max-w-7xl">
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-surface h-56 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="card-surface p-10 text-center">
              <p className="text-ivory/60">Unable to load client reviews right now. Please try again later.</p>
            </div>
          )}

          {!loading && !error && testimonials.length === 0 && (
            <div className="card-surface p-10 text-center">
              <p className="text-ivory/60">No published reviews yet. Be the first to share your experience.</p>
              <Link to="/feedback" className="btn-gold mt-6">
                Share Your Feedback <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {!loading && !error && testimonials.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.article
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className="card-surface flex h-full flex-col p-7"
                >
                  <div className="flex gap-1 text-gold-400" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-ivory/70">"{t.message}"</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-obsidian-border pt-5">
                    <div className="badge-medallion h-11 w-11 shrink-0 text-sm font-bold text-gold-400">
                      {t.clientName?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ivory">{t.clientName}</p>
                      {(t.role || t.company) && (
                        <p className="truncate text-xs text-ivory/50">
                          {t.role}{t.role && t.company ? ", " : ""}{t.company}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-obsidian-border py-16">
        <div className="container-px mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl font-bold text-ivory sm:text-3xl">Worked with PDS?</h2>
          <p className="mt-3 text-sm text-ivory/60">Share your experience and help future clients understand the PDS experience.</p>
          <Link to="/feedback" className="btn-gold mt-6">
            Share Your Feedback <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
