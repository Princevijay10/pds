import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Service from "./models/Service.js";
import Testimonial from "./models/Testimonial.js";

dotenv.config();

const services = [
  {
    title: "Website Design",
    icon: "LayoutTemplate",
    shortDescription: "Modern, conversion-focused website designs tailored to your brand.",
    fullDescription:
      "We design clean, premium websites that reflect your brand identity and guide visitors toward action — from wireframes to pixel-perfect UI.",
    features: ["Custom UI/UX design", "Mobile-first layouts", "Brand-aligned visuals", "Unlimited revisions on drafts"],
    startingPrice: "Starting at ₹7,999",
    order: 1,
  },
  {
    title: "Website Development",
    icon: "Code2",
    shortDescription: "Fast, secure, and scalable websites built with modern technology.",
    fullDescription:
      "From static business sites to full-stack web applications, we build reliable, SEO-ready websites optimized for speed and growth.",
    features: ["Responsive development", "SEO-friendly structure", "Fast load times", "Admin-manageable content"],
    startingPrice: "Starting at ₹12,999",
    order: 2,
  },
  {
    title: "Graphic Design",
    icon: "PenTool",
    shortDescription: "Eye-catching visuals for print and digital that tell your brand's story.",
    fullDescription:
      "Posters, brochures, banners, and marketing creatives crafted with a premium aesthetic that keeps your brand consistent everywhere.",
    features: ["Social creatives", "Print-ready designs", "Brand color consistency", "Fast turnaround"],
    startingPrice: "Starting at ₹999",
    order: 3,
  },
  {
    title: "Social Media Design",
    icon: "Share2",
    shortDescription: "Scroll-stopping social media content that builds real engagement.",
    fullDescription:
      "Monthly content calendars, post design, reels covers, and highlight covers designed to grow your brand's social presence.",
    features: ["Monthly content packs", "Platform-optimized sizing", "Consistent visual identity", "Story templates"],
    startingPrice: "Starting at ₹2,499/mo",
    order: 4,
  },
  {
    title: "Logo & Brand Identity",
    icon: "Crown",
    shortDescription: "Distinctive logos and complete brand identity systems.",
    fullDescription:
      "We craft memorable logos and full brand kits — color palettes, typography, and guidelines — so your business looks premium everywhere.",
    features: ["3 initial concepts", "Full brand guideline PDF", "Source files included", "Business card design"],
    startingPrice: "Starting at ₹1,999",
    order: 5,
  },
];

const testimonials = [
  {
    clientName: "Ankit Sharma",
    role: "Founder",
    company: "Sharma Traders",
    message:
      "Prince Digital Studio designed our entire brand identity and website. The team truly understood our vision and delivered a premium result on time.",
    rating: 5,
  },
  {
    clientName: "Riya Kapoor",
    role: "Marketing Head",
    company: "Kapoor Boutique",
    message:
      "Our social media engagement doubled after PDS took over our content design. Professional, creative, and always on schedule.",
    rating: 5,
  },
  {
    clientName: "Mohit Verma",
    role: "Owner",
    company: "Verma Enterprises",
    message:
      "From logo to website, everything felt cohesive and premium. Highly recommend Prince Digital Studio for any growing business.",
    rating: 5,
  },
];

const run = async () => {
  await connectDB();

  // SECURITY: no fallback credentials. A missing env var must never result in
  // a predictable admin account — that's how sites get taken over silently.
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error(
      "Refusing to seed: ADMIN_EMAIL and ADMIN_PASSWORD must both be set in server/.env.\n" +
      "Set them to real, unique values before running the seed script."
    );
    process.exit(1);
  }
  if (process.env.ADMIN_PASSWORD.length < 8) {
    console.error("Refusing to seed: ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const adminEmail = process.env.ADMIN_EMAIL.toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME || "Admin",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany(services);
    console.log(`Seeded ${services.length} services.`);
  } else {
    console.log("Services already exist, skipping.");
  }

  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany(testimonials);
    console.log(`Seeded ${testimonials.length} testimonials.`);
  } else {
    console.log("Testimonials already exist, skipping.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
