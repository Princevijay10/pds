import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Check, ArrowRight } from "lucide-react";
import SEO from "../components/SEO.jsx";
import api from "../utils/api.js";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => setServices(res.data.services))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Our Services"
        description="Explore Prince Digital Studio's services: website design, website development, graphic design, social media design, and logo & brand identity."
        path="/services"
      />

      <section className="section pt-16">
        <div className="container-px mx-auto max-w-4xl text-center">
          <span className="eyebrow justify-center">What We Offer</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl lg:text-5xl">
            Services Built to <span className="gold-text">Grow Your Brand</span>
          </h1>
          <p className="mt-5 text-ivory/60">
            Every service is delivered with the same premium standard — clean execution,
            honest communication, and results that matter.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-px mx-auto max-w-6xl space-y-6">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-surface h-40 animate-pulse" />
            ))}

          {services.map((s, i) => {
            const Icon = Icons[s.icon] || Icons.Sparkles;
            return (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="card-surface grid gap-8 p-8 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center"
              >
                <div className="badge-medallion h-16 w-16 text-gold-400">
                  <Icon size={28} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-ivory">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/60">{s.fullDescription}</p>
                  {s.features?.length > 0 && (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-ivory/70">
                          <Check size={14} className="shrink-0 text-gold-400" /> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex flex-col items-start gap-3 lg:items-end">
                  {s.startingPrice && (
                    <span className="font-accent text-sm font-semibold text-gold-400">{s.startingPrice}</span>
                  )}
                  <Link to="/contact" className="btn-gold whitespace-nowrap px-6 py-3 text-sm">
                    Enquire <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Services;
