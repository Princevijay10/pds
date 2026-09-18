import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const ServiceCard = ({ service, index = 0 }) => {
  const Icon = Icons[service.icon] || Icons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-surface group relative flex h-full flex-col overflow-hidden p-8 transition-colors duration-300 hover:border-gold-400/50"
    >
      <div className="badge-medallion h-14 w-14 text-gold-400">
        <Icon size={26} />
      </div>
      <h3 className="mt-6 font-display text-xl font-bold text-ivory">{service.title}</h3>
      <div className="flex min-h-0 flex-1 flex-col">
        <p className="mt-3 text-sm leading-relaxed text-ivory/60">{service.shortDescription}</p>
        {service.startingPrice && (
          <p className="mt-4 font-accent text-sm font-semibold text-gold-400">{service.startingPrice}</p>
        )}
        <Link
          to="/contact"
          className="mt-auto pt-6 inline-flex items-center gap-1.5 font-accent text-sm font-semibold text-ivory/80 transition-colors group-hover:text-gold-400"
        >
          Enquire now <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
