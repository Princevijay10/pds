import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Sparkles,
  MessageSquareQuote,
  LogOut,
  ExternalLink,
  Bell,
  UserRound,
  Clock3,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.jpg";
import api from "../../utils/api.js";

const navItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/leads",
    label: "Leads",
    icon: Inbox,
  },
  {
    to: "/admin/portfolio",
    label: "Portfolio",
    icon: FolderKanban,
  },
  {
    to: "/admin/services",
    label: "Services",
    icon: Sparkles,
  },
  {
    to: "/admin/testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [newLeads, setNewLeads] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] =
    useState(false);

  const loadNotifications = useCallback(
    async (showLoading = false) => {
      try {
        if (showLoading) {
          setNotificationLoading(true);
        }

        const [statsResponse, testimonialsResponse] =
          await Promise.all([
            api.get("/dashboard/stats"),
            api.get("/testimonials/admin"),
          ]);

        const stats = statsResponse.data?.stats || {};

        setNewLeads(Number(stats.newLeads || 0));

        const testimonials =
          testimonialsResponse.data?.testimonials || [];

        const pendingCount = testimonials.filter(
          (testimonial) => !testimonial.published
        ).length;

        setPendingReviews(pendingCount);
      } catch (error) {
        // Do not show an error toast every 30 seconds.
        // Dashboard itself handles detailed errors.
        console.error(
          "Notification refresh failed:",
          error
        );
      } finally {
        setNotificationLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadNotifications();

    // Refresh notification counts every 30 seconds.
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  const totalNotifications =
    newLeads + pendingReviews;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleNotificationClick = (path) => {
    setShowNotifications(false);
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-obsidian">
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-obsidian-border bg-obsidian-light md:flex">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-obsidian-border px-6 py-5">
          <img
            src={logo}
            alt="PDS"
            className="h-10 w-10 rounded-full"
          />

          <div>
            <p className="font-display text-sm font-bold text-ivory">
              PDS Admin
            </p>

            <p className="text-[11px] text-ivory/40">
              {user?.name}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gold-400/10 text-gold-400"
                      : "text-ivory/60 hover:bg-obsidian-surface hover:text-ivory"
                  }`
                }
              >
                <Icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-1 border-t border-obsidian-border px-3 py-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-ivory/60 hover:bg-obsidian-surface hover:text-ivory"
          >
            <ExternalLink size={17} />
            View Site
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-ivory/60 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* =================================================
            DESKTOP TOP BAR
        ================================================== */}
        <header className="hidden items-center justify-end border-b border-obsidian-border bg-obsidian-light px-6 py-3 md:flex">
          <div className="relative">
            {/* Notification button */}
            <button
              type="button"
              onClick={() =>
                setShowNotifications(
                  (previous) => !previous
                )
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-obsidian-border text-ivory/60 transition hover:border-gold-400/40 hover:text-gold-400"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell size={18} />

              {totalNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-black">
                  {totalNotifications > 99
                    ? "99+"
                    : totalNotifications}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <NotificationDropdown
                newLeads={newLeads}
                pendingReviews={pendingReviews}
                loading={notificationLoading}
                onNavigate={handleNotificationClick}
                onRefresh={() =>
                  loadNotifications(true)
                }
              />
            )}
          </div>
        </header>

        {/* =================================================
            MOBILE TOP BAR
        ================================================== */}
        <header className="flex items-center justify-between border-b border-obsidian-border bg-obsidian-light px-5 py-4 md:hidden">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="PDS"
              className="h-8 w-8 rounded-full"
            />

            <div>
              <p className="font-display text-sm font-bold text-ivory">
                PDS Admin
              </p>

              <p className="text-[10px] text-ivory/40">
                {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile notification */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowNotifications(
                    (previous) => !previous
                  )
                }
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-obsidian-border text-ivory/60"
                aria-label="Notifications"
              >
                <Bell size={17} />

                {totalNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-bold text-black">
                    {totalNotifications > 9
                      ? "9+"
                      : totalNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown
                  mobile
                  newLeads={newLeads}
                  pendingReviews={pendingReviews}
                  loading={notificationLoading}
                  onNavigate={handleNotificationClick}
                  onRefresh={() =>
                    loadNotifications(true)
                  }
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-red-400"
            >
              Logout
            </button>
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================== */}
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/* =========================================================
   NOTIFICATION DROPDOWN
========================================================= */

const NotificationDropdown = ({
  newLeads,
  pendingReviews,
  loading,
  onNavigate,
  onRefresh,
  mobile = false,
}) => {
  return (
    <div
      className={`absolute z-50 mt-3 w-[320px] overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-light shadow-2xl ${
        mobile
          ? "right-0"
          : "right-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-obsidian-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-ivory">
            Notifications
          </h3>

          <p className="mt-0.5 text-[10px] text-ivory/40">
            Studio activity requiring attention
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="text-[10px] text-gold-400 hover:text-gold-300 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Notifications */}
      <div className="divide-y divide-obsidian-border">
        {/* New Leads */}
        <button
          type="button"
          onClick={() =>
            onNavigate("/admin/leads")
          }
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-obsidian-surface"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
            <Inbox size={16} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ivory">
              New Leads
            </p>

            <p className="mt-0.5 text-xs text-ivory/40">
              {newLeads === 0
                ? "No new leads"
                : `${newLeads} lead${
                    newLeads === 1 ? "" : "s"
                  } waiting for attention`}
            </p>
          </div>

          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
              newLeads > 0
                ? "bg-gold-400 text-black"
                : "bg-obsidian-surface text-ivory/30"
            }`}
          >
            {newLeads}
          </span>
        </button>

        {/* Pending Reviews */}
        <button
          type="button"
          onClick={() =>
            onNavigate("/admin/testimonials")
          }
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-obsidian-surface"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
            <Star size={16} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ivory">
              Pending Reviews
            </p>

            <p className="mt-0.5 text-xs text-ivory/40">
              {pendingReviews === 0
                ? "No reviews waiting"
                : `${pendingReviews} review${
                    pendingReviews === 1 ? "" : "s"
                  } waiting for approval`}
            </p>
          </div>

          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
              pendingReviews > 0
                ? "bg-gold-400 text-black"
                : "bg-obsidian-surface text-ivory/30"
            }`}
          >
            {pendingReviews}
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-obsidian-border px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-ivory/30">
          <Clock3 size={12} />
          Automatically checks every 30 seconds
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;