import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Crown, Globe, Palette, Share2, ArrowUpRight } from "lucide-react";
import SEO from "../components/SEO.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import PortfolioCard from "../components/PortfolioCard.jsx";
import api from "../utils/api.js";
import logo from "../assets/logo.jpg";
import ReviewForm from "../components/ReviewForm.jsx";

const statLabels = [
  { key: "projectsDelivered", label: "Projects Delivered" },
  { key: "happyClients", label: "Happy Clients" },
  { key: "yearsOfCraft", label: "Years of Craft" },
  { key: "avgTurnaroundDays", label: "Avg. Turnaround" },
];

const fallbackServices = [
  {
    _id: "fallback-website-design",
    icon: "Monitor",
    title: "Website Design",
    shortDescription: "Premium, responsive interfaces designed around your brand and business goals.",
  },
  {
    _id: "fallback-website-development",
    icon: "Code2",
    title: "Website Development",
    shortDescription: "Fast, responsive websites built with modern technologies and clean architecture.",
  },
  {
    _id: "fallback-graphic-design",
    icon: "Palette",
    title: "Graphic Design",
    shortDescription: "Professional visual assets for campaigns, marketing, presentations, and brands.",
  },
  {
    _id: "fallback-brand-identity",
    icon: "Gem",
    title: "Logo & Brand Identity",
    shortDescription: "Distinctive visual identities that create consistency and recognition across channels.",
  },
  {
    _id: "fallback-social-media",
    icon: "Share2",
    title: "Social Media Design",
    shortDescription: "Scroll-stopping social creatives designed to communicate clearly and consistently.",
  },
];

const fallbackWork = [
  {
    _id: "fallback-web",
    icon: Globe,
    category: "Website",
    title: "Web Design & Development",
    description: "Responsive digital experiences combining premium UI/UX with practical business functionality.",
  },
  {
    _id: "fallback-brand",
    icon: Palette,
    category: "Brand Identity",
    title: "Logo & Visual Identity",
    description: "Cohesive brand systems covering logos, typography, visual direction, and digital assets.",
  },
  {
    _id: "fallback-content",
    icon: Share2,
    category: "Digital Content",
    title: "Social & Marketing Creatives",
    description: "Campaign-ready graphics and digital content built for clear communication and brand consistency.",
  },
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
  const [stats, setStats] = useState(null);
  const [showHomepageStats, setShowHomepageStats] = useState(true);

  useEffect(() => {
    api.get("/services")
      .then((res) => setServices(res.data.services?.slice(0, 5) || []))
      .catch(() => setServicesError(true))
      .finally(() => setServicesLoading(false));

    api.get("/portfolio?featured=true")
      .then((res) => setProjects(res.data.projects?.slice(0, 6) || []))
      .catch(() => setProjectsError(true))
      .finally(() => setProjectsLoading(false));

    api.get("/site-settings/public")
      .then((res) => setShowHomepageStats(res.data.settings?.showHomepageStats !== false))
      .catch(() => setShowHomepageStats(true));

    api.get("/testimonials")
      .then((res) => setTestimonials(res.data.testimonials?.slice(0, 3) || []))
      .catch(() => setTestimonialsError(true))
      .finally(() => setTestimonialsLoading(false));
  }, []);

  useEffect(() => {
    const fetchStats = () => {
      api.get("/portfolio/stats")
        .then((res) => setStats(res.data.stats || null))
        .catch(() => setStats(null));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
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

            {showHomepageStats && <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {statLabels.map((s) => {
                const value = stats?.[s.key];
                const displayValue =
                  value === null || value === undefined
                    ? "—"
                    : s.key === "avgTurnaroundDays"
                      ? `${value} Days`
                      : `${value}+`;

                return (
                  <div key={s.key}>
                    <p className="font-display text-2xl font-bold text-gold-400 sm:text-3xl">{displayValue}</p>
                    <p className="mt-1 text-xs text-ivory/50">{s.label}</p>
                  </div>
                );
              })}
            </div>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex justify-center"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-gold-gradient opacity-20 blur-3xl" />
            <div
              role="img"
              aria-label="Prince Digital Studio premium website design mockup"
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-gold-400/20 bg-obsidian-surface shadow-2xl"
            >
              <div className="border-b border-obsidian-border px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm font-bold text-ivory">Prince Digital Studio</p>
                    <p className="mt-1 text-[10px] tracking-[0.18em] text-gold-400">DESIGN · DEVELOP · GROW</p>
                  </div>
                  <div className="h-8 w-8 rounded-full border border-gold-400/30 bg-gold-400/10" aria-hidden="true" />
                </div>
              </div>
              <div className="grid gap-5 p-6 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-xl border border-gold-400/20 bg-obsidian p-6">
                  <span className="eyebrow">Digital Studio</span>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-ivory">
                    Premium digital experiences.
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-ivory/50">
                    Clean interfaces, strong brands, and thoughtful development built for growth.
                  </p>
                  <div className="mt-5 h-2 w-24 rounded-full bg-gold-400/70" aria-hidden="true" />
                </div>
                <div className="grid gap-3">
                  <div className="rounded-xl border border-obsidian-border bg-obsidian p-4">
                    <p className="text-xs font-semibold text-ivory">Website Design</p>
                    <p className="mt-1 text-[11px] text-ivory/45">UI / UX</p>
                  </div>
                  <div className="rounded-xl border border-obsidian-border bg-obsidian p-4">
                    <p className="text-xs font-semibold text-ivory">Brand Identity</p>
                    <p className="mt-1 text-[11px] text-ivory/45">Visual System</p>
                  </div>
                  <div className="rounded-xl border border-obsidian-border bg-obsidian p-4">
                    <p className="text-xs font-semibold text-ivory">Development</p>
                    <p className="mt-1 text-[11px] text-ivory/45">Modern Stack</p>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fallbackServices.map((s, i) => (
                <ServiceCard key={s._id} service={s} index={i} />
              ))}
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
              <span className="eyebrow">{projectsError ? "Our Capabilities" : "Selected Work"}</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl">
                {projectsError ? "Design, Development & Digital Content" : "Projects We&apos;re Proud Of"}
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
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fallbackWork.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="card-surface group p-8 transition-colors duration-300 hover:border-gold-400/50"
                >
                  <div className="badge-medallion h-14 w-14 text-gold-400">
                    <item.icon size={26} />
                  </div>
                  <span className="eyebrow mt-6">{item.category}</span>
                  <h3 className="mt-2 font-display text-xl font-bold text-ivory">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">{item.description}</p>
                  <Link
                    to="/contact"
                    className="mt-6 inline-flex items-center gap-1.5 font-accent text-sm font-semibold text-ivory/80 transition-colors group-hover:text-gold-400"
                  >
                    Start a project <ArrowUpRight size={16} />
                  </Link>
                </motion.div>
              ))}
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
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <div className="card-surface p-7 md:col-span-3">
                <div className="mx-auto max-w-2xl text-center">
                  <Star size={28} className="mx-auto text-gold-400" />
                  <h3 className="mt-4 font-display text-xl font-bold text-ivory">
                    Client reviews are temporarily unavailable
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">
                    The website is still fully usable. Published client reviews will appear here automatically when the studio server reconnects.
                  </p>
                  <Link to="/feedback" className="btn-gold mt-6">
                    Share Your Feedback <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
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
                  <p className="mt-4 text-sm leading-relaxed text-ivory/70">&quot;{t.message}&quot;</p>
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
              Tell us about your project and we&apos;ll get back to you within 24 hours with a plan and quote.
            </p>
            <Link to="/contact" className="btn-gold mt-8">
              Let&apos;s Work Together <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;


