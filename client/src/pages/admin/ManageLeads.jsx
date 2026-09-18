import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Trash2,
  Mail,
  Phone,
  Search,
  RefreshCw,
  UserRound,
  CalendarDays,
  IndianRupee,
  BriefcaseBusiness,
  X,
  Inbox,
} from "lucide-react";
import api from "../../utils/api.js";

const statusOptions = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "closed",
];

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
};

const statusColors = {
  new: "bg-gold-400/10 text-gold-400",
  contacted: "bg-blue-400/10 text-blue-400",
  qualified: "bg-purple-400/10 text-purple-400",
  converted: "bg-green-400/10 text-green-400",
  closed: "bg-ivory/10 text-ivory/50",
};

const LEADS_PAGE_SIZE = 20;

const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedLead, setSelectedLead] = useState(null);

  // Debounce the search box so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search.trim()),
      400
    );
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeads = async ({
    pageToLoad = 1,
    append = false,
    showRefresh = false,
  } = {}) => {
    try {
      if (showRefresh) setRefreshing(true);
      else if (append) setLoadingMore(true);
      else setLoading(true);

      const params = new URLSearchParams();
      params.set("page", pageToLoad);
      params.set("limit", LEADS_PAGE_SIZE);
      if (filter) params.set("status", filter);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const response = await api.get(
        `/contact?${params.toString()}`
      );
      const data = response.data;

      setLeads((previous) =>
        append
          ? [...previous, ...(data.leads || [])]
          : data.leads || []
      );
      setPage(data.page || pageToLoad);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load leads"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Filter or (debounced) search changed — start over from page 1.
  useEffect(() => {
    fetchLeads({ pageToLoad: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, debouncedSearch]);

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchLeads({ pageToLoad: page + 1, append: true });
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/contact/${id}`, { status });

      setLeads((previous) =>
        previous.map((lead) =>
          lead._id === id
            ? { ...lead, status }
            : lead
        )
      );

      setSelectedLead((previous) =>
        previous?._id === id
          ? { ...previous, status }
          : previous
      );

      toast.success(
        `Lead marked as ${statusLabels[status]}`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  const deleteLead = async (id) => {
    const confirmed = window.confirm(
      "Delete this lead permanently?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/contact/${id}`);

      setLeads((previous) =>
        previous.filter((lead) => lead._id !== id)
      );
      setTotal((previous) => Math.max(previous - 1, 0));

      if (selectedLead?._id === id) {
        setSelectedLead(null);
      }

      toast.success("Lead deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete lead"
      );
    }
  };

  const filteredLeads = leads;

  return (
    <div>
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">
            Leads
          </h1>

          <p className="mt-1 text-sm text-ivory/50">
            Manage enquiries submitted through your website.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            fetchLeads({ pageToLoad: 1, showRefresh: true })
          }
          disabled={refreshing}
          className="admin-btn admin-btn-secondary"
        >
          <RefreshCw
            size={15}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search name, email, phone or service..."
            className="w-full rounded-lg border border-obsidian-border bg-obsidian-surface py-2.5 pl-10 pr-4 text-sm text-ivory outline-none placeholder:text-ivory/30 focus:border-gold-400/50"
          />
        </div>

        {/* Status filter */}
        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
          className="rounded-lg border border-obsidian-border bg-obsidian-surface px-4 py-2.5 text-sm text-ivory outline-none focus:border-gold-400/50"
        >
          <option value="">All statuses</option>

          {statusOptions.map((status) => (
            <option
              key={status}
              value={status}
            >
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      {/* Result count */}
      {!loading && (
        <p className="mt-4 text-xs text-ivory/40">
          Showing {filteredLeads.length} of {total}{" "}
          {total === 1
            ? "lead"
            : "leads"}
        </p>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}
      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="card-surface h-32 animate-pulse"
              />
            )
          )}
        </div>
      ) : filteredLeads.length === 0 ? (
        /* ===================================================
           EMPTY
        ==================================================== */
        <div className="card-surface mt-6 p-10 text-center">
          <InboxIcon />

          <h2 className="mt-3 font-display text-lg font-bold text-ivory">
            No leads found
          </h2>

          <p className="mt-1 text-sm text-ivory/40">
            {search || filter
              ? "Try changing your search or filter."
              : "New enquiries will appear here automatically."}
          </p>
        </div>
      ) : (
        /* ===================================================
           LEADS
        ==================================================== */
        <div className="mt-6 space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="card-surface p-6 transition hover:border-obsidian-border/80"
            >
              {/* Top */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="badge-medallion h-10 w-10 shrink-0 text-gold-400">
                      <UserRound size={17} />
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-ivory">
                        {lead.name}
                      </h3>

                      <p className="mt-0.5 text-xs text-ivory/40">
                        Lead ID:{" "}
                        {lead._id.slice(-8)}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-ivory/50">
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-1.5 hover:text-gold-300"
                      >
                        <Mail size={12} />
                        {lead.email}
                      </a>
                    )}

                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-1.5 hover:text-gold-300"
                      >
                        <Phone size={12} />
                        {lead.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <select
                    value={lead.status || "new"}
                    onChange={(event) =>
                      updateStatus(
                        lead._id,
                        event.target.value
                      )
                    }
                    className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${
                      statusColors[
                        lead.status
                      ] ||
                      statusColors.new
                    }`}
                  >
                    {statusOptions.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                          className="bg-obsidian text-ivory"
                        >
                          {statusLabels[status]}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      deleteLead(lead._id)
                    }
                    className="admin-icon-btn !border-transparent text-ivory/40 hover:!border-red-400/30 hover:!bg-red-500/10 hover:!text-red-400"
                    title="Delete lead"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Meta */}
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-ivory/50">
                {lead.service && (
                  <span className="flex items-center gap-1.5 rounded-full bg-obsidian px-3 py-1">
                    <BriefcaseBusiness size={12} />
                    {lead.service}
                  </span>
                )}

                {lead.budget && (
                  <span className="flex items-center gap-1.5 rounded-full bg-obsidian px-3 py-1">
                    <IndianRupee size={12} />
                    {lead.budget}
                  </span>
                )}

                <span className="flex items-center gap-1.5 rounded-full bg-obsidian px-3 py-1">
                  <CalendarDays size={12} />

                  {new Date(
                    lead.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Message */}
              <div className="mt-4 rounded-lg bg-obsidian/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-ivory/30">
                  Requirements
                </p>

                <p className="mt-2 text-sm leading-relaxed text-ivory/70">
                  {lead.message || "No message provided."}
                </p>
              </div>

              {/* View details */}
              <button
                type="button"
                onClick={() =>
                  setSelectedLead(lead)
                }
                className="admin-btn admin-btn-ghost !mt-4 !p-0 !text-xs !font-medium !text-gold-400 hover:!text-gold-300"
              >
                View full details →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          LOAD MORE
      ====================================================== */}
      {!loading && leads.length > 0 && page < totalPages && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="admin-btn admin-btn-secondary !px-6"
          >
            {loadingMore
              ? "Loading..."
              : `Load more (${Math.max(total - leads.length, 0)} remaining)`}
          </button>
        </div>
      )}

      {/* =====================================================
          DETAIL MODAL
      ====================================================== */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-obsidian-border bg-obsidian-light p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gold-400">
                  Lead Details
                </p>

                <h2 className="mt-1 font-display text-2xl font-bold text-ivory">
                  {selectedLead.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedLead(null)
                }
                className="admin-icon-btn !border-transparent"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contact information */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailItem
                icon={Mail}
                label="Email"
                value={selectedLead.email}
                href={
                  selectedLead.email
                    ? `mailto:${selectedLead.email}`
                    : undefined
                }
              />

              <DetailItem
                icon={Phone}
                label="Phone"
                value={
                  selectedLead.phone ||
                  "Not provided"
                }
                href={
                  selectedLead.phone
                    ? `tel:${selectedLead.phone}`
                    : undefined
                }
              />

              <DetailItem
                icon={BriefcaseBusiness}
                label="Service"
                value={
                  selectedLead.service ||
                  "Not specified"
                }
              />

              <DetailItem
                icon={IndianRupee}
                label="Budget"
                value={
                  selectedLead.budget ||
                  "Not specified"
                }
              />

              <DetailItem
                icon={CalendarDays}
                label="Submitted"
                value={new Date(
                  selectedLead.createdAt
                ).toLocaleString("en-IN")}
              />

              <DetailItem
                icon={UserRound}
                label="Status"
                value={
                  statusLabels[
                    selectedLead.status
                  ] ||
                  selectedLead.status ||
                  "New"
                }
              />
            </div>

            {/* Message */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ivory/30">
                Customer Requirements
              </p>

              <div className="mt-3 rounded-xl border border-obsidian-border bg-obsidian p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-ivory/70">
                  {selectedLead.message ||
                    "No message provided."}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ivory/30">
                Update Status
              </p>

              <select
                value={
                  selectedLead.status || "new"
                }
                onChange={(event) =>
                  updateStatus(
                    selectedLead._id,
                    event.target.value
                  )
                }
                className={`rounded-lg border border-obsidian-border px-4 py-2.5 text-sm font-semibold outline-none ${
                  statusColors[
                    selectedLead.status
                  ] ||
                  statusColors.new
                }`}
              >
                {statusOptions.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-obsidian text-ivory"
                    >
                      {statusLabels[status]}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Bottom actions */}
            <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-obsidian-border pt-5">
              {selectedLead.email && (
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex items-center gap-2 rounded-lg border border-obsidian-border px-4 py-2.5 text-sm text-ivory/70 hover:border-gold-400/40 hover:text-gold-400"
                >
                  <Mail size={15} />
                  Email
                </a>
              )}

              {selectedLead.phone && (
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex items-center gap-2 rounded-lg border border-obsidian-border px-4 py-2.5 text-sm text-ivory/70 hover:border-gold-400/40 hover:text-gold-400"
                >
                  <Phone size={15} />
                  Call
                </a>
              )}

              <button
                type="button"
                onClick={() =>
                  setSelectedLead(null)
                }
                className="admin-btn admin-btn-primary !px-5"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   EMPTY STATE ICON
========================================================= */

const InboxIcon = () => (
  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
    <Inbox size={20} />
  </div>
);

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
  icon: Icon,
  label,
  value,
  href,
}) => {
  const content = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-400/10 text-gold-400">
        <Icon size={15} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-ivory/30">
          {label}
        </p>

        <p className="mt-1 break-words text-sm text-ivory/70">
          {value}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-start gap-3 rounded-xl border border-obsidian-border p-4 transition hover:border-gold-400/30"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-obsidian-border p-4">
      {content}
    </div>
  );
};

export default ManageLeads;