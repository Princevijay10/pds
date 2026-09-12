import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Instagram, Facebook, Send } from "lucide-react";
import toast from "react-hot-toast";
import SEO from "../components/SEO.jsx";
import api from "../utils/api.js";

const services = [
  "Website Design",
  "Website Development",
  "Graphic Design",
  "Social Media Design",
  "Logo & Brand Identity",
  "Other",
];

const budgets = ["Under ₹5,000", "₹5,000 - ₹15,000", "₹15,000 - ₹50,000", "₹50,000+"];

const initialForm = { name: "", email: "", phone: "", service: "", budget: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      toast.error("Please write a message of at least 10 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/contact", form);
      toast.success(res.data.message || "Message sent successfully!");
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Prince Digital Studio for website design, development, graphic design, and brand identity projects."
        path="/contact"
      />

      <section className="section pt-16">
        <div className="container-px mx-auto max-w-4xl text-center">
          <span className="eyebrow justify-center">Get In Touch</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ivory sm:text-4xl lg:text-5xl">
            Let's Build Something <span className="gold-text">Great Together</span>
          </h1>
          <p className="mt-5 text-ivory/60">
            Share a few details about your project and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="pb-28">
        <div className="container-px mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.3fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="card-surface p-7">
              <div className="badge-medallion h-12 w-12 text-gold-400">
                <Phone size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ivory">Call / WhatsApp</h3>
              <a href="tel:+916367276064" className="mt-1 block text-sm text-ivory/60 hover:text-gold-300">
                +91 63672 76064
              </a>
            </div>
            <div className="card-surface p-7">
              <div className="badge-medallion h-12 w-12 text-gold-400">
                <Mail size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ivory">Email</h3>
              <a
                href="mailto:contact.princedigitalstudio@gmail.com"
                className="mt-1 block break-all text-sm text-ivory/60 hover:text-gold-300"
              >
                contact.princedigitalstudio@gmail.com
              </a>
            </div>
            <div className="card-surface p-7">
              <div className="badge-medallion h-12 w-12 text-gold-400">
                <MapPin size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ivory">Location</h3>
              <p className="mt-1 text-sm text-ivory/60">India (working with clients worldwide)</p>
            </div>
            <div className="flex gap-3">
              <a href="https://instagram.com/Princedigitalstudios" target="_blank" rel="noreferrer" className="badge-medallion h-12 w-12 text-gold-400 hover:bg-gold-400/10">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com/Princedigitalstudios" target="_blank" rel="noreferrer" className="badge-medallion h-12 w-12 text-gold-400 hover:bg-gold-400/10">
                <Facebook size={20} />
              </a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="card-surface space-y-5 p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="service" className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
                  Service Needed
                </label>
                <select
                  id="service"
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory focus:border-gold-400 focus:outline-none"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory focus:border-gold-400 focus:outline-none"
              >
                <option value="">Select a budget</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
                Project Details *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your project, goals, and timeline..."
                className="w-full resize-none rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-60">
              {submitting ? "Sending…" : "Send Message"} <Send size={16} />
            </button>
          </motion.form>
        </div>
      </section>
    </>
  );
};

export default Contact;
