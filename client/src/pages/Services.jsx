import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import { ArrowRight, Sparkles } from "lucide-react";
import api from "../utils/api.js";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/services")
      .then((res) => setServices(res.data.services || []))
      .catch(() => setError("We could not load the services right now."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Our Services"
        description="Explore Prince Digital Studio's website, branding, graphic design, digital marketing, video, and content services."
        path="/services"
      />

      <section className="relative overflow-hidden border-b border-obsidian-border">
        <div className="absolute inset-0 bg-radial-glow opacity-60" />
        <div className="container-px relative mx-auto max-w-6xl py-20 sm:py-28">
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="eyebrow"><Sparkles size={14} /> What We Offer</span>
              <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight text-ivory sm:text-5xl lg:text-6xl">
                Creative services built for <span className="gold-text">real growth.</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-xl text-base leading-7 text-ivory/55 lg:pb-2"
            >
              From websites and brand identity to content and marketing, every service is designed
              to make your business look credible, communicate clearly, and grow online.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="section pt-14 sm:pt-20">
        <div className="container-px mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Our Expertise</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-ivory sm:text-3xl">
                Choose a service and explore it in detail.
              </h2>
            </div>
            <Link to="/contact" className="hidden items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 sm:inline-flex">
              Have a custom requirement? <ArrowRight size={15} />
            </Link>
          </div>

          {loading && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-surface h-64 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="card-surface p-8 text-center text-sm text-ivory/55">{error}</div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="card-surface p-8 text-center text-sm text-ivory/55">
              Services will be available here shortly.
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="space-y-6">
              {services.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-px mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl border border-gold-400/30 bg-gold-400/5 p-7 sm:p-9">
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="eyebrow">Need something specific?</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-ivory">Tell us what you want to build.</h2>
                <p className="mt-2 text-sm text-ivory/55">Share your requirement and we will help you choose the right service.</p>
              </div>
              <Link to="/contact" className="btn-gold shrink-0 px-6 py-3 text-sm">
                Enquiry Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
