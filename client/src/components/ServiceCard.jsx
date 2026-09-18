import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const fallbackImages = {
  "Website Design & Development": "https://images.unsplash.com/photo-1559028012-481c04fa7050?auto=format&fit=crop&w=1200&q=80",
  "Brand Identity & Logo Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
  "Graphic Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
  "Digital Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "Video Editing & Motion Graphics": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
  "Content Writing": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
};

const ServiceCard = ({ service, index = 0 }) => {
  const Icon = Icons[service.icon] || Icons.Sparkles;
  const image = service.image || fallbackImages[service.title];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-surface group overflow-hidden transition-colors duration-300 hover:border-gold-400/50"
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[230px] overflow-hidden bg-obsidian">
          {image ? (
            <img
              src={image}
              alt={service.title + " service"}
              className="h-full min-h-[230px] w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full min-h-[230px] items-center justify-center bg-gradient-to-br from-obsidian-surface to-obsidian">
              <Icon size={64} strokeWidth={1.2} className="text-gold-400/60" aria-hidden="true" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/60 bg-obsidian/80 text-gold-400 backdrop-blur">
            <Icon size={22} aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <span className="eyebrow !text-[10px] !tracking-[0.18em]">PDS Service</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-ivory">{service.title}</h2>
            </div>
            {service.startingPrice && (
              <span className="shrink-0 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1 text-xs font-semibold text-gold-400">
                {service.startingPrice}
              </span>
            )}
          </div>

          <p className="mt-4 line-clamp-2 text-sm leading-6 text-ivory/60">
            {service.shortDescription}
          </p>

          {service.features?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {service.features.slice(0, 3).map((feature) => (
                <span key={feature} className="inline-flex items-center gap-1.5 text-xs text-ivory/55">
                  <CheckCircle2 size={13} className="text-gold-400" aria-hidden="true" />
                  {feature}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to={"/services/" + service._id}
              className="btn-gold px-5 py-3 text-sm"
              aria-label={"Read more about " + service.title}
            >
              Read More <ArrowRight size={16} />
            </Link>
            <Link
              to={"/contact?service=" + encodeURIComponent(service.title)}
              className="btn-ghost px-5 py-3 text-sm"
              aria-label={"Enquiry now for " + service.title}
            >
              Enquiry Now
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ServiceCard;
