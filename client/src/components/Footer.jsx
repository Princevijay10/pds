import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import logo from "../assets/logo.jpg";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-obsidian-border bg-obsidian-light">
      <div className="container-px mx-auto grid max-w-7xl gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Prince Digital Studio" className="h-12 w-12 rounded-full object-cover" />
            <span className="font-display text-lg font-bold text-ivory">Prince Digital Studio</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-ivory/60">
            Designing ideas, building brands, creating impact. Creative solutions for your digital success.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://instagram.com/Princedigitalstudios"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="badge-medallion h-10 w-10 text-gold-400 hover:bg-gold-400/10"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://facebook.com/Princedigitalstudios"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="badge-medallion h-10 w-10 text-gold-400 hover:bg-gold-400/10"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-accent text-sm font-semibold uppercase tracking-wider text-gold-400">Quick Links</h3>
          <ul className="mt-4 space-y-3 text-sm text-ivory/70">
            <li><Link to="/about" className="hover:text-gold-300">About Us</Link></li>
            <li><Link to="/services" className="hover:text-gold-300">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-gold-300">Portfolio</Link></li>
            <li><Link to="/contact" className="hover:text-gold-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-accent text-sm font-semibold uppercase tracking-wider text-gold-400">Services</h3>
          <ul className="mt-4 space-y-3 text-sm text-ivory/70">
            <li>Website Design</li>
            <li>Website Development</li>
            <li>Graphic Design</li>
            <li>Social Media Design</li>
            <li>Logo & Brand Identity</li>
          </ul>
        </div>

        <div>
          <h3 className="font-accent text-sm font-semibold uppercase tracking-wider text-gold-400">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-ivory/70">
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-gold-400" />
              <a href="tel:+916367276064" className="hover:text-gold-300">+91 63672 76064</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-gold-400" />
              <a href="mailto:contact.princedigitalstudio@gmail.com" className="hover:text-gold-300 break-all">
                contact.princedigitalstudio@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-gold-400" />
              <span>India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-obsidian-border py-6">
        <p className="text-center text-xs text-ivory/40">
          © {year} Prince Digital Studio. All rights reserved. | Owner: Prince Vijayvargiy
        </p>
      </div>
    </footer>
  );
};

export default Footer;
