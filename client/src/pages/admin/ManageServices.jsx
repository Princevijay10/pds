import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as Icons from "lucide-react";
import { Plus, Trash2, Pencil, X, Image as ImageIcon, Eye, EyeOff, ExternalLink } from "lucide-react";
import api from "../../utils/api.js";

const emptyForm = {
  title: "",
  icon: "Sparkles",
  image: "",
  galleryImages: "",
  shortDescription: "",
  fullDescription: "",
  features: "",
  startingPrice: "",
  order: 0,
  active: true,
};

const iconOptions = [
  ["Monitor", "Website Design"],
  ["Code2", "Website Development"],
  ["Fingerprint", "Brand / Logo"],
  ["Image", "Graphic Design"],
  ["Share2", "Social Media"],
  ["BarChart3", "Digital Marketing"],
  ["PlayCircle", "Video / Motion"],
  ["FileText", "Content / Writing"],
  ["Sparkles", "Other"],
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1559028012-481c04fa7050?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80",
];

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchServices = () => {
    setLoading(true);
    api.get("/services/admin")
      .then((res) => setServices(res.data.services || []))
      .catch((err) => toast.error(err.response?.data?.message || "Failed to load services"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const activeCount = useMemo(() => services.filter((service) => service.active).length, [services]);
  const hiddenCount = services.length - activeCount;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (service) => {
    setForm({
      title: service.title || "",
      icon: service.icon || "Sparkles",
      image: service.image || "",
      galleryImages: (service.galleryImages || []).join(", "),
      shortDescription: service.shortDescription || "",
      fullDescription: service.fullDescription || "",
      features: (service.features || []).join(", "),
      startingPrice: service.startingPrice || "",
      order: service.order || 0,
      active: service.active ?? true,
    });
    setEditingId(service._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      features: form.features.split(",").map((item) => item.trim()).filter(Boolean),
      galleryImages: form.galleryImages.split(",").map((item) => item.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put("/services/" + editingId, payload);
        toast.success("Service updated successfully");
      } else {
        await api.post("/services", payload);
        toast.success("Service created successfully");
      }
      resetForm();
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service? This action cannot be undone.")) return;
    try {
      await api.delete("/services/" + id);
      setServices((prev) => prev.filter((service) => service._id !== id));
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete service");
    }
  };

  const toggleActive = async (service) => {
    try {
      await api.put("/services/" + service._id, { active: !service.active });
      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id ? { ...item, active: !item.active } : item
        )
      );
      toast.success(service.active ? "Service hidden from website" : "Service published on website");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update visibility");
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-br from-obsidian-surface to-obsidian p-6 sm:p-8">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold-gradient opacity-10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-400">Studio Services</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-ivory sm:text-4xl">Services</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ivory/50">
              Create and manage the services customers see on the PDS website.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { resetForm(); setShowForm(true); }}
            className="admin-btn admin-btn-primary shrink-0 px-5"
          >
            <Plus size={16} /> Add Service
          </button>
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-obsidian-border bg-black/20 p-4">
            <p className="text-2xl font-bold text-ivory">{services.length}</p>
            <p className="mt-1 text-[11px] text-ivory/40">Total Services</p>
          </div>
          <div className="rounded-xl border border-gold-400/20 bg-gold-400/5 p-4">
            <p className="text-2xl font-bold text-gold-400">{activeCount}</p>
            <p className="mt-1 text-[11px] text-ivory/40">Visible on Website</p>
          </div>
          <div className="rounded-xl border border-obsidian-border bg-black/20 p-4">
            <p className="text-2xl font-bold text-ivory">{hiddenCount}</p>
            <p className="mt-1 text-[11px] text-ivory/40">Hidden</p>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="relative mt-6 overflow-hidden rounded-2xl border border-gold-400/25 bg-obsidian-surface p-5 shadow-xl sm:p-7">
          <button type="button" onClick={resetForm} className="admin-icon-btn absolute right-5 top-5" aria-label="Close service form">
            <X size={17} />
          </button>

          <div className="mb-6 pr-12">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">Service Editor</span>
            <h2 className="mt-2 font-display text-xl font-bold text-ivory">
              {editingId ? "Edit Service" : "Create New Service"}
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold text-ivory/60">Service Title</span>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Website Design" className="admin-input" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold text-ivory/60">Service Icon</span>
                  <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="admin-input">
                    {iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-semibold text-ivory/60">Main Image URL</span>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="admin-input" />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold text-ivory/60">Gallery Image URLs <span className="font-normal text-ivory/30">(comma separated)</span></span>
                <input value={form.galleryImages} onChange={(e) => setForm({ ...form, galleryImages: e.target.value })} placeholder="https://..., https://..." className="admin-input" />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold text-ivory/60">Short Description</span>
                <input required value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="One clear line for the service card" className="admin-input" />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold text-ivory/60">Full Description</span>
                <textarea required rows={5} value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} placeholder="Explain the service, deliverables and value..." className="admin-input min-h-[130px] resize-y" />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold text-ivory/60">Key Features <span className="font-normal text-ivory/30">(comma separated)</span></span>
                <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Responsive design, SEO, Fast loading" className="admin-input" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-semibold text-ivory/60">Starting Price <span className="font-normal text-ivory/30">(admin only)</span></span>
                  <input value={form.startingPrice} onChange={(e) => setForm({ ...form, startingPrice: e.target.value })} placeholder="Optional internal value" className="admin-input" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-semibold text-ivory/60">Display Order</span>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="admin-input" />
                </label>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-obsidian-border bg-black/20 p-4">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-gold-400" />
                <span>
                  <span className="block text-sm font-semibold text-ivory">Visible on website</span>
                  <span className="text-xs text-ivory/40">Turn off to keep this service in admin without showing it publicly.</span>
                </span>
              </label>
            </div>

            <div className="rounded-2xl border border-obsidian-border bg-black/20 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-ivory/60">
                <ImageIcon size={14} className="text-gold-400" /> Live Image Preview
              </div>
              <div className="overflow-hidden rounded-xl border border-obsidian-border bg-obsidian">
                <img
                  src={form.image || fallbackImages[0]}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                  onError={(event) => { event.currentTarget.src = fallbackImages[0]; }}
                />
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-obsidian-border bg-obsidian p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400 text-gold-400">
                  {(() => { const PreviewIcon = Icons[form.icon] || Icons.Sparkles; return <PreviewIcon size={19} />; })()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ivory">{form.title || "Service title"}</p>
                  <p className="text-[10px] text-gold-400">PDS Service</p>
                </div>
              </div>
              <p className="mt-4 text-[11px] leading-5 text-ivory/35">
                Tip: use a high-quality landscape image for the public service card and detail page.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-obsidian-border pt-5">
            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary px-6">
              {saving ? "Saving..." : editingId ? "Update Service" : "Create Service"}
            </button>
            <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[330px] animate-pulse rounded-2xl border border-obsidian-border bg-obsidian-surface" />)}
        </div>
      ) : services.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-obsidian-border p-12 text-center">
          <ImageIcon size={28} className="mx-auto text-gold-400/60" />
          <h2 className="mt-4 font-display text-lg font-bold text-ivory">No services yet</h2>
          <p className="mt-2 text-sm text-ivory/40">Create your first service to populate the website.</p>
        </div>
      ) : (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = Icons[service.icon] || Icons.Sparkles;
            const image = service.image || fallbackImages[index % fallbackImages.length];

            return (
              <article key={service._id} className="group overflow-hidden rounded-2xl border border-obsidian-border bg-obsidian-surface transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={image} alt={service.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-gold-400/40 bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-gold-400 backdrop-blur">
                    #{String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full border border-gold-400 bg-black/70 text-gold-400">
                    <Icon size={18} />
                  </div>
                  <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold ${service.active ? "bg-green-400/15 text-green-300" : "bg-red-400/15 text-red-300"}`}>
                    {service.active ? "Live" : "Hidden"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-ivory">{service.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-ivory/50">{service.shortDescription}</p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-obsidian-border pt-4">
                    <button type="button" onClick={() => toggleActive(service)} className="admin-btn admin-btn-ghost !px-0 !text-xs">
                      {service.active ? <EyeOff size={14} /> : <Eye size={14} />}
                      {service.active ? "Hide" : "Publish"}
                    </button>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(service)} className="admin-icon-btn" title="Edit service">
                        <Pencil size={14} />
                      </button>
                      <a href={"/services/" + service._id} target="_blank" rel="noreferrer" className="admin-icon-btn" title="Preview service">
                        <ExternalLink size={14} />
                      </a>
                      <button type="button" onClick={() => deleteService(service._id)} className="admin-icon-btn admin-btn-danger" title="Delete service">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageServices;
