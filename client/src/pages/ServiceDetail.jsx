import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import SEO from "../components/SEO.jsx";
import api from "../utils/api.js";

const fallbackImages = {
  "Website Design & Development": [
    "https://images.unsplash.com/photo-1559028012-481c04fa7050?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80",
  ],
  "Brand Identity & Logo Design": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=1200&q=80",
  ],
  "Graphic Design": [
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
  ],
  "Digital Marketing": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80",
  ],
  "Video Editing & Motion Graphics": [
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
  ],
  "Content Writing": [
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
  ],
};

const ServiceGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const count = images.length;

  useEffect(() => {
    if (count < 2 || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [count, isPaused]);

  useEffect(() => {
    setActiveIndex((current) => (count ? current % count : 0));
  }, [count]);

  if (!count) return null;

  const goNext = () => setActiveIndex((current) => (current + 1) % count);
  const goPrev = () => setActiveIndex((current) => (current - 1 + count) % count);

  const getOffset = (index) => {
    if (count <= 3) return index - activeIndex;

    let offset = index - activeIndex;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  const handlePointerDown = (event) => {
    setDragStart(event.clientX);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsPaused(true);
  };

  const handlePointerUp = (event) => {
    if (dragStart === null) return;

    const distance = event.clientX - dragStart;
    setDragStart(null);
    setIsPaused(false);

    if (Math.abs(distance) < 45) return;
    if (distance < 0) goNext();
    else goPrev();
  };

  return (
    <div className="lg:col-span-2">
      <div className="flex flex-col items-center text-center">
        <span className="eyebrow">Service Gallery</span>
        <h3 className="mt-3 font-display text-2xl font-bold text-ivory sm:text-3xl">
          {title}
        </h3>
        <p className="mt-2 max-w-xl text-sm text-ivory/45">
          Swipe through our work or let the gallery auto-play every 5 seconds.
        </p>
      </div>

      <div
        className="relative mt-7 overflow-hidden rounded-3xl border border-gold-400/10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_55%)] px-2 py-6 sm:px-6 sm:py-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setDragStart(null);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          setDragStart(null);
          setIsPaused(false);
        }}
        style={{ touchAction: "pan-y" }}
        aria-label="Service image gallery"
      >
        <div className="relative mx-auto h-[310px] w-full max-w-6xl sm:h-[390px] lg:h-[470px]">
          {images.map((image, index) => {
            const offset = getOffset(index);
            const visible = Math.abs(offset) <= 1;

            return (
              <motion.div
                key={image + "-" + index}
                animate={{
                  x: offset === 0
                    ? "0%"
                    : offset > 0
                      ? "42%"
                      : "-42%",
                  scale: offset === 0 ? 1 : 0.78,
                  opacity: visible ? (offset === 0 ? 1 : 0.55) : 0,
                  zIndex: offset === 0 ? 30 : 20,
                  rotateY: offset === 0 ? 0 : offset > 0 ? -8 : 8,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute left-1/2 top-1/2 w-[82%] max-w-[680px] -translate-x-1/2 -translate-y-1/2 sm:w-[68%] lg:w-[55%]"
                style={{ perspective: "1200px" }}
              >
                <div className="overflow-hidden rounded-2xl border border-gold-400/30 bg-black shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
                  <img
                    src={image}
                    alt={title + " gallery image " + (index + 1)}
                    draggable="false"
                    className="aspect-[4/3] w-full select-none object-cover"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          className="absolute left-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/70 bg-black/75 text-gold-400 shadow-lg backdrop-blur transition hover:bg-gold-400 hover:text-black sm:left-6 sm:h-12 sm:w-12"
          aria-label="Previous gallery image"
        >
          <ArrowLeft size={19} />
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          className="absolute right-3 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/70 bg-black/75 text-gold-400 shadow-lg backdrop-blur transition hover:bg-gold-400 hover:text-black sm:right-6 sm:h-12 sm:w-12"
          aria-label="Next gallery image"
        >
          <ArrowRight size={19} />
        </button>

        <div className="relative z-40 mt-2 flex items-center justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={"dot-" + image + "-" + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-7 bg-gold-400" : "w-2.5 bg-ivory/25 hover:bg-ivory/50"
              }`}
              aria-label={`Show gallery image ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>

        <div className="relative z-40 mt-4 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] text-ivory/35">
          <span>{isPaused ? "Paused" : "Auto • 5 sec"}</span>
          <span>•</span>
          <span>Swipe / Drag</span>
        </div>
      </div>
    </div>
  );
};

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
      .catch(async () => {
        // Backward-compatible fallback for a local server that has not
        // restarted onto the new public service-detail endpoint yet.
        try {
          const res = await api.get("/services");
          const match = (res.data.services || []).find((item) => item._id === id);
          if (match) {
            setService(match);
            return;
          }
        } catch (fallbackError) {
          console.error("Service fallback error:", fallbackError);
        }
        setNotFound(true);
      })
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
  const displayImages = images.length > 0
    ? images
    : fallbackImages[service.title] || [
        "https://images.unsplash.com/photo-1559028012-481c04fa7050?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      ];

  const galleryDisplayImages = (service.galleryImages || []).filter(Boolean).length > 0
    ? (service.galleryImages || []).filter(Boolean)
    : displayImages.slice(1);

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

            <ServiceGallery
              images={galleryDisplayImages}
              title={service.title}
            />
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
