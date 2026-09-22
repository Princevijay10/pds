import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const PortfolioCard = ({ project, index = 0 }) => {
  const isProjectLink = project.title === "ResumeGeniusAI";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group card-surface overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-obsidian">
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/logo.jpg";
            event.currentTarget.classList.add("object-contain", "p-10", "bg-obsidian");
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <span className="eyebrow">{project.category}</span>
        <h3 className="mt-2 font-display text-lg font-bold text-ivory">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ivory/60">{project.description}</p>

        {project.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-obsidian-border px-2.5 py-1 text-[11px] text-ivory/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-5 w-full text-sm"
            onClick={(event) => event.stopPropagation()}
          >
            {isProjectLink ? "View Project" : "View Live Website"}
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </motion.article>
  );
};

export default PortfolioCard;
