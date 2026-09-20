import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import SEO from "../components/SEO.jsx";
import api from "../utils/api.js";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setProject(null);
    setError(false);

    api
      .get(`/portfolio/${encodeURIComponent(slug)}`)
      .then((res) => setProject(res.data.project))
      .catch((err) => {
        setError(err.response?.status !== 404);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="section text-center text-ivory/50">Loading project…</div>;
  }

  if (error) {
    return (
      <div className="section text-center">
        <p className="text-red-300" role="alert">Unable to load this project right now. Please try again.</p>
        <Link to="/portfolio" className="btn-ghost mt-6 inline-flex">
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="section text-center">
        <p className="text-ivory/60">Project not found.</p>
        <Link to="/portfolio" className="btn-ghost mt-6 inline-flex">
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={project.title} description={project.description} path={`/portfolio/${project.slug}`} />
      <section className="section pt-16">
        <div className="container-px mx-auto max-w-5xl">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm text-ivory/60 hover:text-gold-400">
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <span className="eyebrow">{project.category}</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-ivory sm:text-4xl">{project.title}</h1>
            {project.client && <p className="mt-2 text-sm text-ivory/50">Client: {project.client}</p>}
          </motion.div>

          <motion.img
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            src={project.coverImage}
            alt={project.title}
            className="mt-8 w-full rounded-2xl border border-gold-400/20 shadow-2xl"
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-display text-xl font-bold text-ivory">Project Overview</h2>
              <p className="mt-4 leading-relaxed text-ivory/60">{project.description}</p>
              {project.images?.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {project.images.map((img, i) => (
                    <img key={i} src={img} alt={`${project.title} screenshot ${i + 1}`} className="rounded-xl border border-obsidian-border" loading="lazy" />
                  ))}
                </div>
              )}
            </div>
            <div className="card-surface h-fit p-6">
              {project.tags?.length > 0 && (
                <>
                  <h3 className="font-accent text-xs font-semibold uppercase tracking-wider text-gold-400">Tags</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <span key={t} className="rounded-full border border-obsidian-border px-3 py-1 text-xs text-ivory/60">{t}</span>
                    ))}
                  </div>
                </>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6 w-full text-sm">
                  Visit Live Site <ExternalLink size={15} />
                </a>
              )}
              <Link to="/contact" className="btn-ghost mt-3 w-full text-sm">Start a Similar Project</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetail;
