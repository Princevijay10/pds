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

const ServiceHeroCarousel = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStart, setDragStart] = useState(null);
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
    if (event.target.closest("button")) return;
    setDragStart(event.clientX);
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
    <div
      className="relative w-full"
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
      aria-label="Service image carousel"
    >
      <div className="relative h-[285px] w-full overflow-hidden rounded-3xl border border-gold-400/20 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.10),transparent_62%)] px-2 sm:h-[390px] sm:px-4 lg:h-[450px]">
        {images.map((image, index) => {
          const offset = getOffset(index);
          const visible = Math.abs(offset) <= 1;
          const isCenter = offset === 0;

          const positionClass = isCenter
            ? "left-1/2 w-[68%] sm:w-[58%] lg:w-[52%]"
            : offset < 0
              ? "left-[11%] w-[30%] sm:left-[9%] sm:w-[27%] lg:left-[8%] lg:w-[27%]"
              : "left-[89%] w-[30%] sm:left-[91%] sm:w-[27%] lg:left-[92%] lg:w-[27%]";

          return (
            <motion.div
              key={image + "-" + index}
              initial={false}
              animate={{
                x: "-50%",
                y: "-50%",
                scale: isCenter ? 1 : 0.78,
                opacity: visible ? (isCenter ? 1 : 0.55) : 0,
                zIndex: isCenter ? 30 : 20,
                rotateY: isCenter ? 0 : offset < 0 ? 8 : -8,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 24,
                mass: 0.8,
              }}
              style={{ perspective: "1200px" }}
              className={
                "absolute top-1/2 pointer-events-none " +
                positionClass +
                (isCenter ? "" : " hidden sm:block")
              }
            >
              <div className="overflow-hidden rounded-2xl border border-gold-400/30 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.60)]">
                <img
                  src={image}
                  alt={title + " showcase image " + (index + 1)}
                  draggable="false"
                  className="h-[205px] w-full select-none bg-black object-contain sm:h-[300px] lg:h-[350px]"
                />
              </div>
            </motion.div>
          );
        })}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/80 bg-black/80 text-gold-400 shadow-xl backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-gold-400 hover:text-black sm:left-4 sm:h-11 sm:w-11"
              aria-label="Previous service image"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400/80 bg-black/80 text-gold-400 shadow-xl backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-gold-400 hover:text-black sm:right-4 sm:h-11 sm:w-11"
              aria-label="Next service image"
            >
              <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={"thumb-" + image + "-" + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={
                "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 sm:h-16 sm:w-24 " +
                (index === activeIndex
                  ? "border-gold-400 ring-1 ring-gold-400/40"
                  : "border-obsidian-border opacity-60 hover:opacity-100")
              }
              aria-label={"Show service image " + (index + 1)}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
                draggable="false"
              />
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.18em] text-ivory/35">
        <span>{isPaused ? "Paused" : "Auto • 5 sec"}</span>
        {count > 1 && <><span>•</span><span>Swipe / Drag</span></>}
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

  const carouselImages = displayImages;

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
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            >
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

            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 85, damping: 20, delay: 0.08 }}
              className="relative"
            >
              <ServiceHeroCarousel images={carouselImages} title={service.title} />
              <div className="absolute -bottom-5 left-4 hidden rounded-xl border border-gold-400/30 bg-obsidian-light px-4 py-3 shadow-xl sm:block">
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
          <div className="mx-auto max-w-4xl text-center">
            <span className="eyebrow">About This Service</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-ivory sm:text-4xl">
              From idea to <span className="gold-text">impact.</span>
            </h2>
            <p className="mt-5 whitespace-pre-line text-base leading-8 text-ivory/60">
              {service.fullDescription}
            </p>
          </div>

          {service.features?.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="flex items-start gap-3 rounded-xl border border-obsidian-border bg-obsidian-surface/50 p-4 transition-colors duration-300 hover:border-gold-400/40"
                >
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-gold-400" />
                  <span className="text-sm leading-6 text-ivory/70">{feature}</span>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Link to={"/contact?service=" + encodeURIComponent(service.title)} className="btn-gold px-6 py-3">
              Enquiry Now <MessageCircle size={16} />
            </Link>
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
