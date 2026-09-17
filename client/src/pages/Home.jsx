import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Crown } from "lucide-react";
import SEO from "../components/SEO.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import PortfolioCard from "../components/PortfolioCard.jsx";
import api from "../utils/api.js";
import logo from "../assets/logo.jpg";
import banner from "../assets/banner.jpg";
import ReviewForm from "../components/ReviewForm.jsx";

const stats = [
  { label: "Projects Delivered", value: "50+" },
  { label: "Happy Clients", value: "40+" },
  { label: "Years of Craft", value: "3+" },
  { label: "Avg. Turnaround", value: "7 Days" },
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [projectsError, setProjectsError] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState(false);

  useEffect(() => {
    api.get("/services")
      .then((res) => setServices(res.data.services?.slice(0, 5) || []))
      .catch(() => setServicesError(true))
      .finally(() => setServicesLoading(false));

    api.get("/portfolio?featured=true")
      .then((res) => setProjects(res.data.projects?.slice(0, 6) || []))
      .catch(() => setProjectsError(true))
      .finally(() => setProjectsLoading(false));

    api.get("/testimonials")
      .then((res) => setTestimonials(res.data.testimonials?.slice(0, 3) || []))
      .catch(() => setTestimonialsError(true))
      .finally(() => setTestimonialsLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Premium Website Design & Brand Identity Studio"
        description="Prince Digital Studio designs and develops premium websites, brand identities, and social media content that grow your business."
        path="/"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-radial-glow">
        <div className="container-px mx-auto grid max-w-7xl items-center gap-14 py-20 sm:py-28 lg:grid-cols-2 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow">
              <Crown size={14} /> Design · Develop · Grow
            </div>
            <h1 className="mt-6 font-display text-4xl font-black leading-[1.1] text-ivory sm:text-5xl lg:text-6xl">
              Designing Ideas,
              <br />
              <span className="gold-text">Building Brands,</span>
              <br />
              Creating Impact.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ivory/60 sm:text-lg">
              Prince Digital Studio crafts premium websites, brand identities, and digital
              experiences engineered to grow your business — with a signature black, white
              &amp; gold finish in every detail.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/contact" className="btn-gold">
                Start Your Project <ArrowRight size={18} />
              </Link>
              <Link to="/portfolio" className="btn-ghost">
                View Our Work
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-gold-400 sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-xs text-ivory/50">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex justify-center"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-gold-gradient opacity-20 blur-3xl" />
            <img
              src={banner}
              alt="Prince Digital Studio — design and development showcase"
              className="relative w-full max-w-xl rounded-2xl border border-gold-400/20 shadow-2xl"
            />
            <img
              src={logo}
              alt="Prince Digital Studio medallion logo"
              className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full border-4 border-obsidian shadow-gold animate-float sm:h-28 sm:w-28"
            />
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section border-t border-obsidian-border" aria-busy={servicesLoading}>
        <div className="container-px mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center">Our Services</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl">
              Everything Your Brand Needs to Stand Out
            </h2>
            <p className="mt-4 text-ivory/60">
              From first sketch to final launch — design, development, and content, all under one roof.
            </p>
          </div>

          {servicesLoading ? (
            <div className="mt-14 rounded-2xl border border-obsidian-border bg-obsidian-surface/50 p-10 text-center">
              <p className="text-sm text-ivory/50">Loading services…</p>
            </div>
          ) : servicesError ? (
            <div className="mt-14 rounded-2xl border border-obsidian-border bg-obsidian-surface/50 p-10 text-center">
              <p className="text-sm text-ivory/50">Unable to load services right now.</p>
            </div>
          ) : services.length > 0 ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <ServiceCard key={s._id} service={s} index={i} />
              ))}
            </div>
          ) : (
            <div className="mt-14 rounded-2xl border border-obsidian-border bg-obsidian-surface/50 p-10 text-center">
              <p className="text-sm text-ivory/50">Our services will appear here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Portfolio preview */}
      <section className="section border-t border-obsidian-border" aria-busy={projectsLoading}>
        <div className="container-px mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Selected Work</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl">
                Projects We're Proud Of
              </h2>
            </div>
            <Link to="/portfolio" className="btn-ghost">
              View All Work <ArrowRight size={16} />
            </Link>
          </div>

          {projectsLoading ? (
            <div className="mt-12 rounded-2xl border border-obsidian-border bg-obsidian-surface/50 p-10 text-center">
              <p className="text-sm text-ivory/50">Loading our work…</p>
            </div>
          ) : projectsError ? (
            <div className="mt-12 rounded-2xl border border-obsidian-border bg-obsidian-surface/50 p-10 text-center">
              <p className="text-sm text-ivory/50">Unable to load our work right now.</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <PortfolioCard key={p._id} project={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-obsidian-border bg-obsidian-surface/50 p-10 text-center">
              <p className="text-sm text-ivory/50">Our latest projects will appear here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section border-t border-obsidian-border" aria-busy={testimonialsLoading}>
        <div className="container-px mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center">Client Trust</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl">
              What Our Clients Say
            </h2>
          </div>

          {testimonialsLoading ? (
            <div className="mt-14 rounded-2xl border border-obsidian-border bg-obsidian-surface/50 p-10 text-center">
              <p className="text-sm text-ivory/50">Loading client reviews…</p>
            </div>
          ) : testimonialsError ? (
            <div className="mt-14 rounded-2xl border border-obsidian-border bg-obsidian-surface/50 p-10 text-center">
              <p className="text-sm text-ivory/50">Unable to load client reviews right now.</p>
            </div>
          ) : testimonials.length > 0 ? (
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card-surface p-7"
                >
                  <div className="flex gap-1 text-gold-400">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/70">"{t.message}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="badge-medallion h-10 w-10 text-sm font-bold text-gold-400">
                      {t.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ivory">{t.clientName}</p>
                      <p className="text-xs text-ivory/50">
                        {t.role}{t.company ? `, ${t.company}` : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-14 rounded-2xl border border-obsidian-border bg-obsidian-surface/50 p-10 text-center">
              <p className="text-sm text-ivory/50">Client reviews will appear here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Review Form */}
      <section className="section border-t border-obsidian-border">
        <div className="container-px mx-auto max-w-2xl">
          <ReviewForm />
        </div>
      </section>

      {/* CTA */}
      <section className="section border-t border-obsidian-border">
        <div className="container-px mx-auto max-w-5xl">
          <div className="card-surface relative overflow-hidden px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-gradient opacity-20 blur-3xl" />
            <h2 className="font-display text-3xl font-bold text-ivory sm:text-4xl">
              Ready to Build Something <span className="gold-text">Premium?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/60">
              Tell us about your project and we'll get back to you within 24 hours with a plan and quote.
            </p>
            <Link to="/contact" className="btn-gold mt-8">
              Let's Work Together <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
