import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Inbox,
  FolderKanban,
  Sparkles,
  MessageSquareQuote,
  AlertCircle,
  Clock3,
  Check,
  RefreshCw,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api.js";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showHomepageStats, setShowHomepageStats] = useState(true);
  const [savingStatsSetting, setSavingStatsSetting] = useState(false);

  const loadDashboard = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [statsResponse, reviewsResponse, settingsResponse] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/testimonials/admin"),
        api.get("/site-settings/admin"),
      ]);

      setData(statsResponse.data);

      setReviews(reviewsResponse.data.testimonials || []);
      setShowHomepageStats(
        settingsResponse.data?.settings?.showHomepageStats !== false
      );
    } catch (error) {
      console.error("Dashboard loading error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    // Refresh dashboard data every 30 seconds.
    const interval = setInterval(() => {
      loadDashboard(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadDashboard]);

  const toggleHomepageStats = async () => {
    const nextValue = !showHomepageStats;

    try {
      setSavingStatsSetting(true);
      await api.put("/site-settings/admin", {
        showHomepageStats: nextValue,
      });
      setShowHomepageStats(nextValue);
      toast.success(
        nextValue
          ? "Homepage statistics are now visible."
          : "Homepage statistics are now hidden."
      );
    } catch (error) {
      console.error("Homepage statistics setting error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update homepage statistics visibility"
      );
    } finally {
      setSavingStatsSetting(false);
    }
  };

  const approveReview = async (review) => {
    try {
      await api.put(`/testimonials/${review._id}`, {
        published: true,
      });

      toast.success("Review approved and published.");

      await loadDashboard(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve review"
      );
    }
  };

  const pendingReviews = reviews.filter(
    (review) => !review.published
  );

  const cards = data
    ? [
        {
          label: "Total Leads",
          value: data.stats.totalLeads,
          icon: Inbox,
          link: "/admin/leads",
        },
        {
          label: "New Leads",
          value: data.stats.newLeads,
          icon: AlertCircle,
          link: "/admin/leads",
        },
        {
          label: "Portfolio Projects",
          value: data.stats.totalProjects,
          icon: FolderKanban,
          link: "/admin/portfolio",
        },
        {
          label: "Services",
          value: data.stats.totalServices,
          icon: Sparkles,
          link: "/admin/services",
        },
        {
          label: "Testimonials",
          value: data.stats.totalTestimonials,
          icon: MessageSquareQuote,
          link: "/admin/testimonials",
        },
        {
          label: "Pending Reviews",
          value: pendingReviews.length,
          icon: Clock3,
          link: "/admin/testimonials",
          highlight: pendingReviews.length > 0,
        },
      ]
    : [];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-start gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-ivory/50">
            Overview of your studio&apos;s activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="admin-btn admin-btn-ghost"
        >
          <RefreshCw
            size={15}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <section className="card-surface mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between" aria-labelledby="homepage-stats-setting">
        <div>
          <h2 id="homepage-stats-setting" className="font-display text-base font-bold text-ivory">
            Homepage Statistics
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ivory/45">
            Control whether the live Projects Delivered, Happy Clients, Years of Craft, and Avg. Turnaround statistics appear on the public homepage.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={showHomepageStats}
          aria-label="Show homepage statistics"
          onClick={toggleHomepageStats}
          disabled={savingStatsSetting}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian ${
            showHomepageStats
              ? "border-gold-400 bg-gold-400"
              : "border-obsidian-border bg-obsidian-surface"
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-5 w-5 rounded-full bg-ivory shadow transition-transform ${
              showHomepageStats ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </section>

      {/* Dashboard Cards */}
      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="card-surface h-28 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.label}
                to={card.link}
                className={`group card-surface flex items-center gap-5 px-7 py-6 transition hover:border-gold-400/40 ${
                  card.highlight
                    ? "border-gold-400/30"
                    : ""
                }`}
              >
                <div className="badge-medallion h-12 w-12 text-gold-400">
                  <Icon size={20} />
                </div>

                <div>
                  <p className="font-sans text-2xl font-bold text-ivory tabular-nums">
                    {card.value}
                  </p>

                  <p className="text-xs text-ivory/50">
                    {card.label}
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="ml-auto text-ivory/30 transition group-hover:text-gold-400"
                />
              </Link>
            );
          })}
        </div>
      )}

      {/* Recent Enquiries */}
      {data?.recentLeads?.length > 0 && (
        <div className="mt-10">
          <div className="flex items-start justify-between gap-3">
            <div className="px-5">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-lg font-bold text-ivory">
                  Recent Enquiries
                </h2>

                <Link
                  to="/admin/leads"
                  className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300"
                >
                  View all
                  <ArrowRight size={13} />
                </Link>
              </div>

              <p className="mt-1 text-xs text-ivory/40">
                Latest customer enquiries received through the website.
              </p>
            </div>
          </div>

          <div className="card-surface mt-4 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-obsidian-border text-xs uppercase tracking-wider text-ivory/40">
                  <th className="px-5 py-3">
                    Name
                  </th>

                  <th className="px-5 py-3">
                    Email
                  </th>

                  <th className="px-5 py-3">
                    Service
                  </th>

                  <th className="px-5 py-3 text-right">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.recentLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-b border-obsidian-border last:border-0"
                  >
                    <td className="px-5 py-3 text-ivory">
                      {lead.name}
                    </td>

                    <td className="px-5 py-3 text-ivory/60">
                      {lead.email}
                    </td>

                    <td className="px-5 py-3 text-ivory/60">
                      {lead.service || "-"}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs text-ivory/60">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-ivory/40"
                        />
                        {lead.status
                          ? lead.status.charAt(0).toUpperCase() +
                            lead.status.slice(1).toLowerCase()
                          : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-ivory">
                Pending Reviews
              </h2>

              <p className="mt-1 text-xs text-ivory/40">
                Customer reviews waiting for approval.
              </p>
            </div>

            <Link
              to="/admin/testimonials"
              className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300"
            >
              Manage reviews
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {pendingReviews.slice(0, 6).map((review) => (
              <div
                key={review._id}
                className="card-surface p-5"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-ivory">
                      {review.clientName}
                    </h3>

                    <p className="mt-1 text-xs text-ivory/40">
                      {review.role || "Customer"}

                      {review.company
                        ? ` • ${review.company}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= review.rating
                            ? "fill-gold-400 text-gold-400"
                            : "text-ivory/20"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Message */}
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-ivory/60">
                  &quot;{review.message}&quot;
                </p>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-gold-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-400">
                    Pending Approval
                  </span>

                  <button
                    type="button"
                    onClick={() => approveReview(review)}
                    className="admin-btn admin-btn-primary !text-xs"
                  >
                    <Check size={14} />
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pendingReviews.length > 6 && (
            <div className="mt-4 text-center">
              <Link
                to="/admin/testimonials"
                className="text-xs text-gold-400 hover:text-gold-300"
              >
                View all {pendingReviews.length} pending reviews
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        pendingReviews.length === 0 &&
        (!data?.recentLeads ||
          data.recentLeads.length === 0) && (
          <div className="card-surface mt-10 p-8 text-center">
            <Check
              size={28}
              className="mx-auto text-gold-400"
            />

            <h2 className="mt-3 font-display text-lg font-bold text-ivory">
              Everything is up to date
            </h2>

            <p className="mt-1 text-sm text-ivory/40">
              No new leads or pending reviews require your attention.
            </p>
          </div>
        )}
    </div>
  );
};

export default Dashboard;
