import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      data-testid="navbar"
      className="backdrop-blur-xl bg-[#0B0B0B]/80 border-b border-[#1E2328] sticky top-0 z-50 transition-all"
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
            <span className="text-lg font-semibold text-[#F5F5F7] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              HimPrash
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" data-testid="nav-desktop-links">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={`nav-${link.label.toLowerCase()}`}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? "text-[#0A84FF]"
                    : "text-[#A1A1AA] hover:text-[#F5F5F7]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            data-testid="nav-mobile-toggle"
            className="md:hidden p-2 text-[#A1A1AA] hover:text-[#F5F5F7] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav
            data-testid="nav-mobile-links"
            className="md:hidden pb-4 border-t border-[#1E2328] pt-4 flex flex-col gap-3"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={`nav-mobile-${link.label.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium px-2 py-1.5 transition-colors duration-200 ${
                  isActive(link.to)
                    ? "text-[#0A84FF]"
                    : "text-[#A1A1AA] hover:text-[#F5F5F7]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
