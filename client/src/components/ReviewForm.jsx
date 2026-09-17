import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api.js";

const ReviewForm = () => {
  const location = useLocation();
  const [form, setForm] = useState({ clientName: "", email: "", role: "", company: "", message: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.message.trim().length < 10) {
      toast.error("Please write at least 10 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/testimonials/public", { ...form, rating: Number(form.rating) });
      toast.success("Thank you! Your review has been submitted for approval.");
      setForm({ clientName: "", email: "", role: "", company: "", message: "", rating: 5 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (location.pathname === "/") {
    return (
      <section className="border-t border-obsidian-border py-14 sm:py-16">
        <div className="container-px mx-auto max-w-3xl">
          <div className="card-surface px-7 py-10 text-center sm:px-10">
            <span className="eyebrow normal-case tracking-normal justify-center">Share Your Experience</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-ivory sm:text-3xl">Have feedback for PDS?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ivory/50">
              Read what our clients say, or share your own experience on our dedicated feedback page.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <a href="#testimonials" className="btn-ghost">Read Reviews</a>
              <Link to="/feedback" className="btn-gold">Share Your Feedback <Send size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="card-surface p-7">
      <div className="mb-6">
        <span className="eyebrow normal-case tracking-normal">Share Your Experience</span>
        <h1 className="mt-3 font-display text-2xl font-bold text-ivory sm:text-3xl">Tell Us What You Think</h1>
        <p className="mt-2 text-sm text-ivory/50">Your feedback helps us improve and helps others understand the PDS experience.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div><label className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60" htmlFor="review-client-name">Name *</label><input id="review-client-name" required name="clientName" value={form.clientName} onChange={handleChange} placeholder="Your name" className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none" /></div>
        <div><label className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60" htmlFor="review-email">Email</label><input id="review-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60" htmlFor="review-role">Role (optional)</label><input id="review-role" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Founder, Manager" className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none" /></div>
          <div><label className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60" htmlFor="review-company">Company (optional)</label><input id="review-company" name="company" value={form.company} onChange={handleChange} placeholder="Your company name" className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none" /></div>
        </div>
        <div><label className="mb-3 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">Your Rating *</label><div className="flex gap-2">{[1,2,3,4,5].map((star) => <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className="transition-transform hover:scale-110" aria-label={`${star} star`}><Star size={25} className={star <= form.rating ? "fill-gold-400 text-gold-400" : "text-ivory/20"} /></button>)}</div></div>
        <div><label className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60" htmlFor="review-message">Your Review *</label><textarea id="review-message" required name="message" rows={5} maxLength={1000} value={form.message} onChange={handleChange} placeholder="Tell us about your experience..." className="w-full resize-none rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none" /></div>
        <button type="submit" disabled={submitting} className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Submitting..." : "Submit Review"}<Send size={16} /></button>
        <p className="text-center text-xs text-ivory/40">Reviews are checked before being published.</p>
      </form>
    </div>
  );
};

export default ReviewForm;
