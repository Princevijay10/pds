import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.jpg";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [window.location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-obsidian/90 backdrop-blur-md border-b border-obsidian-border" : "bg-transparent"
      }`}
    >
      <nav className="container-px mx-auto flex max-w-7xl items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="Prince Digital Studio home">
          <img src={logo} alt="Prince Digital Studio logo" className="h-12 w-12 rounded-full object-cover" />
          <div className="hidden flex-col sm:flex">
            <span className="font-display text-lg font-bold leading-tight text-ivory">Prince Digital Studio</span>
            <span className="text-xs tracking-[0.3em] uppercase text-gold-400">Design · Develop · Grow</span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `font-accent text-sm font-medium transition-colors ${
                  isActive ? "text-gold-400" : "text-ivory/80 hover:text-gold-300"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-gold px-5 py-2.5 text-sm">
            Get a Quote
          </Link>
        </div>

        <button
          className="rounded-full border border-gold-400/40 p-2 text-gold-400 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-obsidian-border bg-obsidian md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 font-accent text-sm font-medium ${
                      isActive ? "bg-gold-400/10 text-gold-400" : "text-ivory/80"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/contact" onClick={() => setOpen(false)} className="btn-gold mt-2 py-3 text-sm">
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
