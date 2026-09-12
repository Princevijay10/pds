import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.jpg";

const AdminLogin = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  const submitLogin = async () => {
    if (loading) return;

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast.error("Please enter your email.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await login(cleanEmail, password);

      toast.success("Login successful!");

      const redirectTo =
        location.state?.from?.pathname ||
        location.state?.from ||
        "/admin";

      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Admin login error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Login failed. Please check your email and password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await submitLogin();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian bg-radial-glow px-6">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="Prince Digital Studio"
            className="h-16 w-16 rounded-full object-cover"
          />

          <h1 className="mt-5 font-display text-2xl font-bold text-ivory">
            Admin Panel
          </h1>

          <p className="mt-1 text-sm text-ivory/50">
            Prince Digital Studio
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="card-surface mt-8 space-y-5 p-8"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 flex items-center gap-2 text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60"
            >
              <Mail size={13} />
              Email
            </label>

            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory focus:border-gold-400 focus:outline-none"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 flex items-center gap-2 text-xs font-accent font-semibold uppercase tracking-wider text-ivory/60"
            >
              <Lock size={13} />
              Password
            </label>

            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitLogin();
                }
              }}
              className="w-full rounded-lg border border-obsidian-border bg-obsidian px-4 py-3 text-sm text-ivory focus:border-gold-400 focus:outline-none"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;