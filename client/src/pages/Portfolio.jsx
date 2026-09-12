import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO.jsx";
import PortfolioCard from "../components/PortfolioCard.jsx";
import api from "../utils/api.js";

const categories = [
  "All",
  "Website Design",
  "Website Development",
  "Graphic Design",
  "Social Media Design",
  "Logo & Brand Identity",
];

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = active === "All" ? "" : `?category=${encodeURIComponent(active)}`;
    api
      .get(`/portfolio${query}`)
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <>
      <SEO
        title="Portfolio"
        description="Explore Prince Digital Studio's portfolio of website design, development, graphic design, and brand identity projects."
        path="/portfolio"
      />

      <section className="section pt-16">
        <div className="container-px mx-auto max-w-4xl text-center">
          <span className="eyebrow justify-center">Our Work</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl lg:text-5xl">
            Projects Crafted with <span className="gold-text">Precision</span>
          </h1>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 px-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2 font-accent text-xs font-medium transition-colors sm:text-sm ${
                active === c
                  ? "border-gold-400 bg-gold-400/10 text-gold-400"
                  : "border-obsidian-border text-ivory/60 hover:border-gold-400/40 hover:text-ivory"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-px mx-auto max-w-7xl">
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-surface aspect-[4/3] animate-pulse" />
              ))}
            </div>
          )}

          {!loading && projects.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center text-ivory/50"
            >
              No projects in this category yet — check back soon.
            </motion.p>
          )}

          {!loading && projects.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <Link key={p._id} to={`/portfolio/${p.slug}`}>
                  <PortfolioCard project={p} index={i} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Portfolio;
