import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-[#1E2328] bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#0A84FF] rounded-sm flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-base font-semibold text-[#F5F5F7] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                HimPrash
              </span>
            </Link>
            <p className="text-sm text-[#71717A] max-w-xs">
              Smart EV Accessories Platform built by real users, for real users.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <Link to="/" className="text-sm text-[#A1A1AA] hover:text-[#F5F5F7] transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm text-[#A1A1AA] hover:text-[#F5F5F7] transition-colors">
              Products
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[#1E2328] flex items-center justify-between">
          <p className="text-xs text-[#71717A]">
            &copy; {new Date().getFullYear()} HimPrash. All rights reserved.
          </p>
          <p className="text-xs text-[#71717A]">
            Built for EV enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
