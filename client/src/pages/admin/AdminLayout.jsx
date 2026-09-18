import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Sparkles,
  MessageSquareQuote,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Clock3,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.jpg";
import api from "../../utils/api.js";
import { enablePushNotifications, sendPushTest } from "../../utils/pushNotifications.js";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
  { to: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
  { to: "/admin/services", label: "Services", icon: Sparkles },
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
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadNotifications = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setNotificationLoading(true);

      const [statsResponse, testimonialsResponse] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/testimonials/admin"),
      ]);

      const stats = statsResponse.data?.stats || {};
      const testimonials = testimonialsResponse.data?.testimonials || [];
      const pendingCount = testimonials.filter(
        (testimonial) => !testimonial.published
      ).length;

      setNewLeads(Number(stats.newLeads || 0));
      setPendingReviews(pendingCount);
    } catch (error) {
      console.error("Notification refresh failed:", error);
    } finally {
      setNotificationLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => loadNotifications(), 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const totalNotifications = newLeads + pendingReviews;

  const handleEnablePush = async () => {
    try {
      setPushLoading(true);
      await enablePushNotifications();
      setPushEnabled(true);
      toast.success("Mobile lead notifications enabled.");
    } catch (error) {
      toast.error(error.message || "Could not enable mobile notifications.");
    } finally {
      setPushLoading(false);
    }
  };

  const handleTestPush = async () => {
    try {
      setPushLoading(true);
      await sendPushTest();
      toast.success("Test notification sent to your devices.");
    } catch (error) {
      toast.error(error.message || "Could not send test notification.");
    } finally {
      setPushLoading(false);
    }
  };

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
      <aside className="hidden w-64 shrink-0 flex-col border-r border-obsidian-border bg-obsidian-light md:flex">
        <div className="flex items-center gap-3 border-b border-obsidian-border px-6 py-5">
          <img src={logo} alt="PDS" className="h-10 w-10 rounded-full" />
          <div>
            <p className="font-display text-sm font-bold text-ivory">
              PDS Admin
            </p>
            <p className="text-[11px] text-ivory/40">{user?.name}</p>
          </div>
        </div>

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

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="hidden items-center justify-between border-b border-obsidian-border bg-obsidian-light px-6 py-3 md:flex">
          <div className="flex items-center gap-2">
            {!pushEnabled ? (
              <button
                type="button"
                onClick={handleEnablePush}
                disabled={pushLoading}
                className="rounded-lg border border-gold-400/30 px-3 py-2 text-xs font-semibold text-gold-400 hover:bg-gold-400/10 disabled:opacity-50"
              >
                {pushLoading ? "Enabling..." : "Enable Mobile Alerts"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTestPush}
                disabled={pushLoading}
                className="rounded-lg border border-green-400/30 px-3 py-2 text-xs font-semibold text-green-400 hover:bg-green-400/10 disabled:opacity-50"
              >
                {pushLoading ? "Sending..." : "Test Mobile Alert"}
              </button>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((previous) => !previous)}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-obsidian-border text-ivory/60 transition hover:border-gold-400/40 hover:text-gold-400"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell size={18} />
              {totalNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-black">
                  {totalNotifications > 99 ? "99+" : totalNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationDropdown
                newLeads={newLeads}
                pendingReviews={pendingReviews}
                loading={notificationLoading}
                onNavigate={handleNotificationClick}
                onRefresh={() => loadNotifications(true)}
              />
            )}
          </div>
        </header>

        <header className="flex items-center justify-between border-b border-obsidian-border bg-obsidian-light px-5 py-4 md:hidden">
          <div className="flex items-center gap-2">
            <img src={logo} alt="PDS" className="h-8 w-8 rounded-full" />
            <div>
              <p className="font-display text-sm font-bold text-ivory">
                PDS Admin
              </p>
              <p className="text-[10px] text-ivory/40">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={pushEnabled ? handleTestPush : handleEnablePush}
              disabled={pushLoading}
              className="rounded-lg border border-gold-400/30 px-2.5 py-2 text-[10px] font-semibold text-gold-400 disabled:opacity-50"
              title={pushEnabled ? "Send test notification" : "Enable mobile notifications"}
            >
              {pushLoading ? "..." : pushEnabled ? "Test" : "Alerts"}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((previous) => !previous)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-obsidian-border text-ivory/60"
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell size={17} />
                {totalNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-bold text-black">
                    {totalNotifications > 9 ? "9+" : totalNotifications}
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
                  onRefresh={() => loadNotifications(true)}
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((previous) => !previous)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-obsidian-border text-ivory/60"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-red-400"
            >
              Logout
            </button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="border-b border-obsidian-border bg-obsidian-light px-4 py-3 md:hidden">
            <nav className="grid gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
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
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-ivory/60 hover:bg-obsidian-surface hover:text-ivory"
              >
                <ExternalLink size={17} />
                View Site
              </a>
            </nav>
          </div>
        )}

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NotificationDropdown = ({
  newLeads,
  pendingReviews,
  loading,
  onNavigate,
  onRefresh,
  mobile = false,
}) => {
  const dropdownPosition = mobile ? "right-0" : "right-0";

  return (
    <div
      className={`absolute z-50 mt-3 w-[320px] overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-light shadow-2xl ${dropdownPosition}`}
    >
      <div className="flex items-center justify-between border-b border-obsidian-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-ivory">Notifications</h3>
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

      <div className="divide-y divide-obsidian-border">
        <button
          type="button"
          onClick={() => onNavigate("/admin/leads")}
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-obsidian-surface"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
            <Inbox size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ivory">New Leads</p>
            <p className="mt-0.5 text-xs text-ivory/40">
              {newLeads === 0
                ? "No new leads"
                : `${newLeads} lead${newLeads === 1 ? "" : "s"} waiting for attention`}
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

        <button
          type="button"
          onClick={() => onNavigate("/admin/testimonials")}
          className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-obsidian-surface"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
            <Star size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ivory">Pending Reviews</p>
            <p className="mt-0.5 text-xs text-ivory/40">
              {pendingReviews === 0
                ? "No reviews waiting"
                : `${pendingReviews} review${pendingReviews === 1 ? "" : "s"} waiting for approval`}
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
