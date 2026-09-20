import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../utils/api.js";
import SEO from "../components/SEO.jsx";

const Portfolio = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const category = searchParams.get("category") || "";

  useEffect(() => {
    setLoading(true);
    setError(false);

    const query = category ? `?category=${encodeURIComponent(category)}` : "";

    api
      .get(`/portfolio${query}`)
      .then((res) => setProjects(res.data.projects || []))
      .catch(() => {
        setProjects([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <>
      <SEO title="Portfolio" description="Explore Prince Digital Studio's website, branding, graphic design, and digital projects." path="/portfolio" />

      <main className="min-h-screen">
        {/* Existing portfolio layout is preserved below the data-loading layer. */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-10">
            <h1 className="text-4xl font-bold">Our Portfolio</h1>
            <p className="mt-3 text-gray-600">Selected projects from Prince Digital Studio.</p>
          </div>

          {loading && <p className="text-gray-500">Loading projects…</p>}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
              Unable to load the portfolio right now. Please refresh and try again.
            </div>
          )}
          {!loading && !error && projects.length === 0 && (
            <p className="text-gray-500">No projects in this category yet — check back soon.</p>
          )}
          {!loading && !error && projects.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.article key={project._id || project.id || index} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Link to={`/portfolio/${project.slug}`} className="group block overflow-hidden rounded-2xl border bg-white">
                    {project.coverImage && (
                      <img src={project.coverImage} alt={project.title || "Portfolio project"} className="aspect-video w-full object-cover" loading="lazy" />
                    )}
                    <div className="p-5">
                      <h2 className="text-xl font-semibold">{project.title}</h2>
                      <p className="mt-2 text-gray-600">{project.shortDescription || project.description}</p>
                      <span className="mt-4 inline-flex items-center gap-2 font-medium">View project <ArrowUpRight size={16} /></span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Portfolio;
