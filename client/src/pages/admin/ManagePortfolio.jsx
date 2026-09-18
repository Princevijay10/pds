import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, X, UploadCloud } from "lucide-react";
import api from "../../utils/api.js";

const categories = [
  "Website Design",
  "Website Development",
  "Graphic Design",
  "Social Media Design",
  "Logo & Brand Identity",
  "Other",
];

const emptyForm = {
  title: "",
  category: categories[0],
  client: "",
  deliveryDays: "",
  description: "",
  coverImage: "",
  liveUrl: "",
  tags: "",
  featured: false,
  published: true,
};

const ManagePortfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    api
      .get("/portfolio/admin")
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProjects, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      category: p.category,
      client: p.client || "",
      deliveryDays: p.deliveryDays ?? "",
      description: p.description,
      coverImage: p.coverImage,
      liveUrl: p.liveUrl || "",
      tags: (p.tags || []).join(", "),
      featured: p.featured,
      published: p.published,
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, coverImage: res.data.url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.coverImage) {
      toast.error("Please upload a cover image");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      deliveryDays: form.deliveryDays === "" ? undefined : Number(form.deliveryDays),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/portfolio/${editingId}`, payload);
        toast.success("Project updated");
      } else {
        await api.post("/portfolio", payload);
        toast.success("Project created");
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project permanently?")) return;
    try {
      await api.delete(`/portfolio/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Portfolio</h1>
          <p className="mt-1 text-sm text-ivory/50">Manage the projects shown on your public portfolio.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-gold px-5 py-2.5 text-sm">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface relative mt-6 space-y-5 p-6">
          <button type="button" onClick={resetForm} className="absolute right-5 top-5 text-ivory/40 hover:text-ivory">
            <X size={18} />
          </button>
          <h2 className="font-display text-lg font-bold text-ivory">{editingId ? "Edit Project" : "New Project"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Client name (optional)" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />
            <input type="number" min="1" max="365" placeholder="Delivery days (optional)" value={form.deliveryDays} onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })} className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />
            <input placeholder="Live URL (optional)" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />
          </div>

          <textarea required rows={3} placeholder="Project description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full resize-none rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />

          <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />

          <div>
            <label className="mb-2 block text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60">Cover Image *</label>
            <div className="flex items-center gap-4">
              <label className="btn-ghost cursor-pointer px-4 py-2.5 text-sm">
                <UploadCloud size={16} /> {uploading ? "Uploading…" : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
              {form.coverImage && <img src={form.coverImage} alt="Preview" className="h-14 w-14 rounded-lg object-cover" />}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ivory/70">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-gold-400" />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-sm text-ivory/70">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-gold-400" />
              Published
            </label>
          </div>

          <button type="submit" disabled={saving} className="btn-gold px-6 py-2.5 text-sm disabled:opacity-60">
            {saving ? "Saving…" : editingId ? "Update Project" : "Create Project"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card-surface h-64 animate-pulse" />)}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p._id} className="card-surface overflow-hidden">
              <img src={p.coverImage} alt={p.title} className="h-40 w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-ivory">{p.title}</h3>
                  {!p.published && <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[10px] text-red-400">Draft</span>}
                </div>
                <p className="mt-1 text-xs text-ivory/50">{p.category}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-obsidian-border py-2 text-xs text-ivory/70 hover:border-gold-400/40 hover:text-gold-400">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => deleteProject(p._id)} className="flex items-center justify-center rounded-lg border border-obsidian-border px-3 text-red-400/80 hover:border-red-400/40">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePortfolio;
