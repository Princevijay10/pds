import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const fallbackImages = [
  "https://images.unsplash.com/photo-1559028012-481c04fa7050?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
];

const serviceIconMap = [
  { match: ["website design"], icon: "Monitor" },
  { match: ["website development"], icon: "Code2" },
  { match: ["brand", "logo"], icon: "Fingerprint" },
  { match: ["graphic"], icon: "Image" },
  { match: ["social media"], icon: "Share2" },
  { match: ["marketing"], icon: "BarChart3" },
  { match: ["video", "motion"], icon: "PlayCircle" },
  { match: ["content", "writing"], icon: "FileText" },
];

const getServiceIcon = (title) => {
  const normalized = title.toLowerCase();
  const found = serviceIconMap.find(({ match }) =>
    match.some((term) => normalized.includes(term))
  );
  return found?.icon || "Sparkles";
};

const ServiceCard = ({ service, index = 0 }) => {
  const Icon = Icons[getServiceIcon(service.title)] || Icons.Sparkles;
  const image = service.image || fallbackImages[index % fallbackImages.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group flex h-full min-h-[470px] flex-col overflow-hidden rounded-2xl border border-obsidian-border bg-obsidian-surface shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-gold sm:min-h-[500px]"
    >
      <div className="relative h-44 shrink-0 overflow-hidden bg-obsidian sm:h-48">
        <img
          src={image}
          alt={service.title + " service"}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400 bg-black/70 text-gold-400 backdrop-blur-sm">
          <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-5 lg:p-4 xl:p-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">
          PDS Service
        </span>

        <h3 className="mt-2 min-h-[3.4rem] font-display text-lg font-bold leading-tight text-ivory sm:text-xl">
          {service.title}
        </h3>

        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-ivory/60">
          {service.shortDescription}
        </p>

        {service.features?.length > 0 && (
          <ul className="mt-4 min-h-[4.5rem] space-y-1.5">
            {service.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-ivory/55">
                <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-gold-400" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto grid grid-cols-1 gap-2 pt-6 xl:grid-cols-2">
          <Link
            to={"/services/" + service._id}
            className="btn-gold w-full px-3 py-2.5 text-xs sm:text-sm"
            aria-label={"Read more about " + service.title}
          >
            Read More <ArrowRight size={15} />
          </Link>
          <Link
            to={"/contact?service=" + encodeURIComponent(service.title)}
            className="btn-ghost w-full px-3 py-2.5 text-xs sm:text-sm"
            aria-label={"Enquiry now for " + service.title}
          >
            Enquiry Now
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default ServiceCard;
