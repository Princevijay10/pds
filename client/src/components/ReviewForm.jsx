import { useState } from "react";
import { Star, Send } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api.js";

const ReviewForm = () => {
  const [form, setForm] = useState({
    clientName: "",
    email: "",
    role: "",
    company: "",
    message: "",
    rating: 5,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.message.trim().length < 10) {
      toast.error("Please write at least 10 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/testimonials/public", {
        ...form,
        rating: Number(form.rating),
      });

      toast.success(
        "Thank you! Your review has been submitted for approval."
      );

      setForm({
        clientName: "",
        email: "",
        role: "",
        company: "",
        message: "",
        rating: 5,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to submit your review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-surface p-7">
      <div className="mb-6">
        <span className="eyebrow">Share Your Experience</span>

        <h3 className="mt-3 font-display text-2xl font-bold text-ivory">
          Tell Us What You Think
        </h3>

        <p className="mt-2 text-sm text-ivory/50">
          Your feedback helps us improve and helps others understand
          the PDS experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
            Name *
          </label>

          <input
            required
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none"
          />
        </div>

        {/* Role + Company */}
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Role (optional)"
            className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none"
          />

          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company (optional)"
            className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="mb-3 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
            Your Rating *
          </label>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    rating: star,
                  })
                }
                className="transition-transform hover:scale-110"
                aria-label={`${star} star`}
              >
                <Star
                  size={25}
                  className={
                    star <= form.rating
                      ? "fill-gold-400 text-gold-400"
                      : "text-ivory/20"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
            Your Review *
          </label>

          <textarea
            required
            name="message"
            rows={5}
            maxLength={1000}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us about your experience..."
            className="w-full resize-none rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Review"}
          <Send size={16} />
        </button>

        <p className="text-center text-xs text-ivory/40">
          Reviews are checked before being published.
        </p>
      </form>
    </div>
  );
};

export default ReviewForm;