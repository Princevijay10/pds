import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Star,
  Check,
  EyeOff,
} from "lucide-react";
import api from "../../utils/api.js";

const emptyForm = {
  clientName: "",
  role: "",
  company: "",
  message: "",
  rating: 5,
  published: true,
};

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await api.get("/testimonials/admin");
      setTestimonials(res.data.testimonials || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load testimonials"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (testimonial) => {
    setForm({
      clientName: testimonial.clientName || "",
      role: testimonial.role || "",
      company: testimonial.company || "",
      message: testimonial.message || "",
      rating: testimonial.rating || 5,
      published: testimonial.published ?? true,
    });

    setEditingId(testimonial._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.clientName.trim()) {
      toast.error("Client name is required.");
      return;
    }

    if (form.message.trim().length < 10) {
      toast.error("Testimonial must contain at least 10 characters.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, form);
        toast.success("Testimonial updated");
      } else {
        await api.post("/testimonials", {
          ...form,
          source: "admin",
        });

        toast.success("Testimonial added");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to save testimonial"
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (testimonial) => {
    try {
      await api.put(`/testimonials/${testimonial._id}`, {
        published: !testimonial.published,
      });

      toast.success(
        testimonial.published
          ? "Review hidden"
          : "Review approved and published"
      );

      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update review"
      );
    }
  };

  const deleteTestimonial = async (id) => {
    const confirmed = window.confirm(
      "Delete this testimonial?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/testimonials/${id}`);

      setTestimonials((prev) =>
        prev.filter((testimonial) => testimonial._id !== id)
      );

      toast.success("Testimonial deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete testimonial"
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">
            Testimonials
          </h1>

          <p className="mt-1 text-sm text-ivory/50">
            Manage client testimonials and customer reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-gold px-5 py-2.5 text-sm"
        >
          <Plus size={16} />
          Add Testimonial
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="card-surface relative mt-6 space-y-5 p-6"
        >
          <button
            type="button"
            onClick={resetForm}
            className="absolute right-5 top-5 text-ivory/40 hover:text-ivory"
            aria-label="Close form"
          >
            <X size={18} />
          </button>

          <h2 className="font-display text-lg font-bold text-ivory">
            {editingId
              ? "Edit Testimonial"
              : "New Testimonial"}
          </h2>

          {/* Client details */}
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              required
              placeholder="Client name"
              value={form.clientName}
              onChange={(e) =>
                setForm({
                  ...form,
                  clientName: e.target.value,
                })
              }
              className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory"
            />

            <input
              placeholder="Role (e.g. Founder)"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
              className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory"
            />

            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) =>
                setForm({
                  ...form,
                  company: e.target.value,
                })
              }
              className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory"
            />
          </div>

          {/* Message */}
          <textarea
            required
            rows={4}
            minLength={10}
            maxLength={1000}
            placeholder="Testimonial message"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
            className="w-full resize-none rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory"
          />

          {/* Rating */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">
              Rating
            </label>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      rating,
                    })
                  }
                  aria-label={`${rating} star rating`}
                >
                  <Star
                    size={20}
                    className={
                      rating <= form.rating
                        ? "fill-gold-400 text-gold-400"
                        : "text-obsidian-border"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Published */}
          <label className="flex items-center gap-2 text-sm text-ivory/70">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({
                  ...form,
                  published: e.target.checked,
                })
              }
              className="accent-gold-400"
            />

            Published (visible on site)
          </label>

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="btn-gold px-6 py-2.5 text-sm disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Testimonial"
              : "Add Testimonial"}
          </button>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="card-surface h-24 animate-pulse"
            />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="card-surface mt-6 p-8 text-center">
          <p className="text-sm text-ivory/50">
            No testimonials or reviews yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="card-surface p-5"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-ivory">
                    {testimonial.clientName}
                  </h3>

                  <p className="text-xs text-ivory/50">
                    {testimonial.role}

                    {testimonial.company
                      ? `, ${testimonial.company}`
                      : ""}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  {/* Approve / Hide */}
                  <button
                    type="button"
                    onClick={() =>
                      togglePublished(testimonial)
                    }
                    className="rounded-lg border border-obsidian-border p-2 text-ivory/70 hover:border-gold-400/40 hover:text-gold-400"
                    title={
                      testimonial.published
                        ? "Hide review"
                        : "Approve review"
                    }
                  >
                    {testimonial.published ? (
                      <EyeOff size={13} />
                    ) : (
                      <Check size={13} />
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(testimonial)
                    }
                    className="rounded-lg border border-obsidian-border p-2 text-ivory/70 hover:border-gold-400/40 hover:text-gold-400"
                    title="Edit testimonial"
                  >
                    <Pencil size={13} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      deleteTestimonial(testimonial._id)
                    }
                    className="rounded-lg border border-obsidian-border p-2 text-red-400/80 hover:border-red-400/40"
                    title="Delete testimonial"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= testimonial.rating
                        ? "fill-gold-400 text-gold-400"
                        : "text-ivory/20"
                    }
                  />
                ))}
              </div>

              {/* Message */}
              <p className="mt-3 text-sm text-ivory/60">
                "{testimonial.message}"
              </p>

              {/* Status */}
              <div className="mt-3">
                {testimonial.published ? (
                  <span className="inline-block rounded-full bg-green-400/10 px-2 py-0.5 text-[10px] text-green-400">
                    Published
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-red-400/10 px-2 py-0.5 text-[10px] text-red-400">
                    Pending Approval
                  </span>
                )}
              </div>

              {/* Source */}
              {testimonial.source === "customer" && (
                <span className="mt-2 inline-block rounded-full bg-gold-400/10 px-2 py-0.5 text-[10px] text-gold-400">
                  Customer Review
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;