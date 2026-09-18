import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import SEO from "../components/SEO.jsx";
import api from "../utils/api.js";

const fallbackImages = [
  "https://images.unsplash.com/photo-1559028012-481c04fa7050?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
];

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get("/services/" + id)
      .then((res) => setService(res.data.service))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="section text-center text-ivory/50">Loading service…</div>;

  if (notFound || !service) {
    return (
      <div className="section text-center">
        <p className="text-ivory/60">Service not found.</p>
        <Link to="/services" className="btn-ghost mt-6 inline-flex">
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>
    );
  }

  const Icon = Icons[service.icon] || Icons.Sparkles;
  const images = [service.image, ...(service.galleryImages || [])].filter(Boolean);
  const displayImages = images.length > 0 ? images.slice(0, 2) : fallbackImages;

  return (
    <>
      <SEO title={service.title} description={service.shortDescription} path={"/services/" + service._id} />

      <section className="relative overflow-hidden border-b border-obsidian-border">
        <div className="absolute inset-0 bg-radial-glow opacity-60" />
        <div className="container-px relative mx-auto max-w-6xl py-14 sm:py-20">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-ivory/50 hover:text-gold-400">
            <ArrowLeft size={15} /> Back to Services
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="eyebrow"><Icon size={14} /> {service.title}</span>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ivory sm:text-5xl">
                {service.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ivory/60">{service.shortDescription}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to={"/contact?service=" + encodeURIComponent(service.title)} className="btn-gold px-6 py-3">
                  Enquiry Now <ArrowRight size={16} />
                </Link>
                <Link to="/portfolio" className="btn-ghost px-6 py-3">
                  See Our Work
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative">
              <img
                src={displayImages[0]}
                alt={service.title + " showcase"}
                className="aspect-[4/3] w-full rounded-2xl border border-gold-400/20 object-cover shadow-2xl"
              />
              <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-gold-400/30 bg-obsidian-light px-4 py-3 shadow-xl sm:block">
                <div className="flex items-center gap-2 text-xs font-semibold text-gold-400">
                  <Sparkles size={13} /> Premium PDS Service
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-px mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="eyebrow">About This Service</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ivory">
                From idea to <span className="gold-text">impact.</span>
              </h2>
              <p className="mt-5 whitespace-pre-line text-base leading-8 text-ivory/60">{service.fullDescription}</p>

              {service.features?.length > 0 && (
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 rounded-xl border border-obsidian-border bg-obsidian-surface/50 p-4">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-gold-400" />
                      <span className="text-sm text-ivory/70">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              <Link to={"/contact?service=" + encodeURIComponent(service.title)} className="btn-gold mt-8 px-6 py-3">
                Enquiry Now <MessageCircle size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {displayImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={service.title + " example " + (index + 1)}
                  className="w-full rounded-2xl border border-obsidian-border object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-px mx-auto max-w-6xl">
          <div className="card-surface flex flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <span className="eyebrow">Ready to start?</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-ivory">
                Let&apos;s discuss your {service.title.toLowerCase()} requirement.
              </h2>
              {service.startingPrice && <p className="mt-2 text-sm text-gold-400">{service.startingPrice}</p>}
            </div>
            <Link to={"/contact?service=" + encodeURIComponent(service.title)} className="btn-gold shrink-0 px-6 py-3">
              Enquiry Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
