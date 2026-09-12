import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import api from "../../utils/api.js";

const emptyForm = {
  title: "",
  icon: "Sparkles",
  shortDescription: "",
  fullDescription: "",
  features: "",
  startingPrice: "",
  order: 0,
  active: true,
};

const iconOptions = ["LayoutTemplate", "Code2", "PenTool", "Share2", "Crown", "Sparkles", "Palette", "Camera"];

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchServices = () => {
    setLoading(true);
    api.get("/services/admin").then((res) => setServices(res.data.services)).finally(() => setLoading(false));
  };

  useEffect(fetchServices, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (s) => {
    setForm({ ...s, features: (s.features || []).join(", ") });
    setEditingId(s._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, features: form.features.split(",").map((f) => f.trim()).filter(Boolean) };
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, payload);
        toast.success("Service updated");
      } else {
        await api.post("/services", payload);
        toast.success("Service created");
      }
      resetForm();
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Services</h1>
          <p className="mt-1 text-sm text-ivory/50">Manage the services listed on your site.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-gold px-5 py-2.5 text-sm">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface relative mt-6 space-y-5 p-6">
          <button type="button" onClick={resetForm} className="absolute right-5 top-5 text-ivory/40 hover:text-ivory">
            <X size={18} />
          </button>
          <h2 className="font-display text-lg font-bold text-ivory">{editingId ? "Edit Service" : "New Service"}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Service title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory">
              {iconOptions.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <input required placeholder="Short description (card summary)" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />
          <textarea required rows={3} placeholder="Full description" value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} className="w-full resize-none rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />
          <input placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />

          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Starting price (e.g. Starting at ₹4,999)" value={form.startingPrice} onChange={(e) => setForm({ ...form, startingPrice: e.target.value })} className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />
            <input type="number" placeholder="Display order" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="rounded-lg border border-obsidian-border bg-obsidian px-4 py-2.5 text-sm text-ivory" />
          </div>

          <label className="flex items-center gap-2 text-sm text-ivory/70">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-gold-400" />
            Active (visible on site)
          </label>

          <button type="submit" disabled={saving} className="btn-gold px-6 py-2.5 text-sm disabled:opacity-60">
            {saving ? "Saving…" : editingId ? "Update Service" : "Create Service"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="mt-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card-surface h-20 animate-pulse" />)}</div>
      ) : (
        <div className="mt-6 space-y-3">
          {services.map((s) => (
            <div key={s._id} className="card-surface flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-display font-bold text-ivory">{s.title}</h3>
                <p className="mt-0.5 text-xs text-ivory/50">{s.shortDescription}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => handleEdit(s)} className="rounded-lg border border-obsidian-border p-2 text-ivory/70 hover:border-gold-400/40 hover:text-gold-400">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteService(s._id)} className="rounded-lg border border-obsidian-border p-2 text-red-400/80 hover:border-red-400/40">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageServices;
