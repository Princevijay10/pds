import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import { ArrowRight, Crown, Heart, Zap } from "lucide-react";
import api from "../utils/api.js";

const heroImage =
  "https://images.unsplash.com/photo-1559028012-481c04fa7050?auto=format&fit=crop&w=1800&q=85";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/services")
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
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40" />
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/90 to-transparent" />

        <div className="container-px relative mx-auto grid max-w-7xl items-center gap-10 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="eyebrow">
              <Crown size={14} /> Our Services
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-black leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
              Creative Solutions
              <br />
              for Your <span className="gold-text">Growth</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-ivory/65 sm:text-lg">
              From websites to branding, we create digital experiences that make your business
              stand out, communicate clearly, and grow with confidence.
            </p>

            <div className="mt-7 flex flex-wrap gap-7 text-sm text-ivory/70">
              <span className="inline-flex items-center gap-2"><Zap size={16} className="text-gold-400" /> Creative Approach</span>
              <span className="inline-flex items-center gap-2"><Crown size={16} className="text-gold-400" /> Quality Focused</span>
              <span className="inline-flex items-center gap-2"><Heart size={16} className="text-gold-400" /> Client Focused</span>
            </div>

            <Link to="/contact" className="btn-gold mt-8 inline-flex px-6 py-3">
              Enquiry Now <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gold-400/25 shadow-2xl">
              <img
                src={heroImage}
                alt="Premium digital design workspace"
                className="aspect-[5/4] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-xl border border-gold-400/30 bg-black/65 px-4 py-3 backdrop-blur">
                <p className="font-display text-lg font-bold text-ivory">Design · Develop · Grow</p>
                <p className="mt-1 text-xs text-gold-400">Everything your brand needs under one roof.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section pt-14 sm:pt-20">
        <div className="container-px mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center">Explore Our Services</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl">
              Everything You Need to <span className="gold-text">Build & Grow</span>
            </h2>
            <p className="mt-4 text-sm leading-6 text-ivory/55 sm:text-base">
              Choose a service to learn what we deliver, how we work, and how we can help your business.
            </p>
          </div>

          {loading && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[430px] animate-pulse rounded-2xl border border-obsidian-border bg-obsidian-surface" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-gold-400/20 bg-obsidian-surface p-8 text-center text-sm text-ivory/55">
              {error}
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-obsidian-border bg-obsidian-surface p-8 text-center text-sm text-ivory/55">
              Services will be available here shortly.
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-px mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-gold-400/35 bg-obsidian-surface p-7 sm:p-9">
            <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-gold-gradient opacity-10 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="eyebrow">Need something specific?</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-ivory sm:text-3xl">
                  Have a custom requirement?
                </h2>
                <p className="mt-2 max-w-xl text-sm text-ivory/55">
                  Tell us your idea and we will help you choose the right service or create a custom solution.
                </p>
              </div>
              <Link to="/contact" className="btn-gold shrink-0 px-6 py-3">
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
