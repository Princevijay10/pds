import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin, ArrowUpRight, MessageCircle } from "lucide-react";
import logo from "../assets/logo.jpg";

const Footer = () => {
  const year = new Date().getFullYear();

  const features = [
    { label: "Website Design", to: "/services" },
    { label: "Website Development", to: "/services" },
    { label: "Brand Identity", to: "/services" },
    { label: "Graphic Design", to: "/services" },
    { label: "Social Media Design", to: "/services" },
  ];

  const learnMore = [
    { label: "About Us", to: "/about" },
    { label: "Our Work", to: "/portfolio" },
    { label: "Services", to: "/services" },
    { label: "Client Reviews", to: "/testimonials" },
    { label: "Feedback", to: "/feedback" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <footer className="border-t border-obsidian-border bg-obsidian-light" aria-label="Site footer">
      <div className="container-px mx-auto max-w-7xl py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.9fr_0.9fr_0.8fr] lg:gap-10">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Prince Digital Studio home">
              <img
                src={logo}
                alt="Prince Digital Studio logo"
                className="h-14 w-14 rounded-full object-cover ring-1 ring-gold-400/30"
              />
              <div>
                <span className="block font-display text-xl font-bold leading-tight text-ivory">
                  Prince Digital Studio
                </span>
                <span className="mt-1 block text-[10px] font-semibold tracking-[0.22em] text-gold-400">
                  DESIGN · DEVELOP · GROW
                </span>
              </div>
            </Link>

            <div className="mt-8">
              <div className="badge-medallion h-14 w-14 text-gold-400" aria-hidden="true">
                <Mail size={25} />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-ivory">Get In Touch!</h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/55">
                Have a project in mind? Let&apos;s turn your ideas into something amazing.
              </p>
              <Link to="/contact" className="btn-gold mt-5">
                Contact Us <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>

          <nav aria-labelledby="footer-features">
            <h3 id="footer-features" className="font-accent text-sm font-semibold text-ivory">
              Features
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-ivory/65">
              {features.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="transition-colors hover:text-gold-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-learn-more">
            <h3 id="footer-learn-more" className="font-accent text-sm font-semibold text-ivory">
              Learn More
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-ivory/65">
              {learnMore.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="transition-colors hover:text-gold-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-accent text-sm font-semibold text-ivory">Socials</h3>
            <div className="mt-5 space-y-4 text-sm text-ivory/65">
              <a
                href="https://instagram.com/Princedigitalstudios"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold-300"
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-gold-400" aria-hidden="true" />
                Instagram
              </a>
              <a
                href="https://facebook.com/Princedigitalstudios"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold-300"
                aria-label="Facebook"
              >
                <Facebook size={18} className="text-gold-400" aria-hidden="true" />
                Facebook
              </a>
              <a
                href="https://wa.me/916367276064"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-gold-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} className="text-gold-400" aria-hidden="true" />
                WhatsApp
              </a>
            </div>

            <div className="mt-8 space-y-3 border-t border-obsidian-border pt-6 text-xs text-ivory/50">
              <a href="tel:+916367276064" className="flex items-center gap-2 hover:text-gold-300">
                <Phone size={14} className="text-gold-400" aria-hidden="true" />
                +91 63672 76064
              </a>
              <a
                href="mailto:contact.princedigitalstudio@gmail.com"
                className="flex items-start gap-2 break-all hover:text-gold-300"
              >
                <Mail size={14} className="mt-0.5 shrink-0 text-gold-400" aria-hidden="true" />
                contact.princedigitalstudio@gmail.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-gold-400" aria-hidden="true" />
                India
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-obsidian-border pt-6">
          <div className="flex flex-col gap-3 text-xs text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} Prince Digital Studio. All rights reserved.</p>
            <p>
              Designed with <span className="text-gold-400" aria-label="love">♥</span> by{" "}
              <span className="font-semibold text-gold-400">PDS</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
