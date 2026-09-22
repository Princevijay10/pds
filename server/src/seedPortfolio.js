import Portfolio from "./models/Portfolio.js";

const PROJECTS = [
  {
    title: "Prince Digital Studio",
    category: "Website Development",
    description: "PDS की अपनी official website। इसमें modern UI, responsive design, services, portfolio और contact functionality है.",
    coverImage: "/portfolio/prince-digital-studio.svg",
    liveUrl: "https://princedigitalstudio.onrender.com/",
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    featured: true,
    published: true,
    order: 1,
  },
  {
    title: "Rajasthan Shiksha Mahavidyalaya",
    category: "Website Development",
    description: "RSM के लिए institutional website, जिसमें college information, academics, activities, gallery और contact-related sections हैं.",
    coverImage: "/portfolio/rsm.svg",
    liveUrl: "https://rsmjaipur.page.gd/",
    tags: ["HTML", "CSS", "JavaScript", "PHP", "Responsive Design"],
    featured: true,
    published: true,
    order: 2,
  },
  {
    title: "ResumeGeniusAI",
    category: "Website Development",
    description: "Resume बनाने, manage करने और career/job-related suggestions देने वाला full-stack project.",
    coverImage: "/portfolio/resumegeniusai.svg",
    liveUrl: "https://github.com/Princevijay10/resume-genius-ai",
    tags: ["React", "Node.js", "Express", "MongoDB", "AI API"],
    featured: true,
    published: true,
    order: 3,
  },
];

export const ensurePortfolioProjects = async () => {
  for (const project of PROJECTS) {
    await Portfolio.updateOne(
      { title: project.title },
      { $setOnInsert: project },
      { upsert: true }
    );
  }
  console.log("Portfolio projects checked.");
};
