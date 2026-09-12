import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const PortfolioCard = ({ project, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: index * 0.06 }}
    className="group card-surface overflow-hidden"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={project.coverImage}
        alt={project.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="badge-medallion absolute right-4 top-4 h-10 w-10 translate-y-2 text-gold-400 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`View ${project.title} live`}
        >
          <ExternalLink size={16} />
        </a>
      )}
    </div>
    <div className="p-6">
      <span className="eyebrow">{project.category}</span>
      <h3 className="mt-2 font-display text-lg font-bold text-ivory">{project.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-ivory/60">{project.description}</p>
    </div>
  </motion.div>
);

export default PortfolioCard;
