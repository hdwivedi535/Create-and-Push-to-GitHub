import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-[#1F2937] bg-[#0C0F14]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#0A84FF] rounded-sm flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-base font-semibold text-[#E8E8ED] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                HimPrash
              </span>
            </Link>
            <p className="text-sm text-[#6B6B78] max-w-xs">
              India's smart EV accessories platform for electric two-wheeler riders.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <Link to="/" className="text-sm text-[#8B8B96] hover:text-[#E8E8ED] transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm text-[#8B8B96] hover:text-[#E8E8ED] transition-colors">
              Products
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[#1F2937] flex items-center justify-between">
          <p className="text-xs text-[#6B6B78]">
            &copy; {new Date().getFullYear()} HimPrash. All rights reserved.
          </p>
          <p className="text-xs text-[#6B6B78]">
            Made in India for EV riders
          </p>
        </div>
      </div>
    </footer>
  );
}
