import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header
      data-testid="navbar"
      className="backdrop-blur-xl bg-[#0E1117]/90 border-b border-[#1F2937] sticky top-0 z-50 transition-all"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-[#0A84FF] rounded-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Zap className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-lg font-semibold text-[#F0F0F5] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              HimPrash
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10" data-testid="nav-desktop-links">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={`nav-${link.label.toLowerCase()}`}
                className={`relative text-sm font-medium transition-colors duration-200 py-1 ${
                  isActive(link.to)
                    ? "text-[#0A84FF]"
                    : "text-[#8B8B96] hover:text-[#E8E8ED]"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-[#0A84FF] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Contact + Mobile menu */}
          <div className="flex items-center gap-4">
            {/* Contact (desktop) */}
            <a
              href="tel:+918707259761"
              data-testid="nav-contact"
              className="hidden md:flex items-center gap-1.5 text-xs text-[#8B8B96] hover:text-[#00FF9D] transition-colors"
            >
              <Phone className="w-3 h-3" strokeWidth={1.5} />
              +91 8707259761
            </a>

            {/* Mobile menu button */}
            <button
              data-testid="nav-mobile-toggle"
              className="md:hidden p-2 text-[#8B8B96] hover:text-[#E8E8ED] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav
            data-testid="nav-mobile-links"
            className="md:hidden pb-4 border-t border-[#1F2937] pt-4 flex flex-col gap-3"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={`nav-mobile-${link.label.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium px-2 py-1.5 transition-colors duration-200 rounded-md ${
                  isActive(link.to)
                    ? "text-[#0A84FF] bg-[#0A84FF]/10"
                    : "text-[#8B8B96] hover:text-[#E8E8ED]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+918707259761"
              className="flex items-center gap-2 text-sm text-[#8B8B96] px-2 py-1.5"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
              +91 8707259761
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
