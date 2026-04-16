import { Link } from "react-router-dom";
import { Zap, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-[#1F2937] bg-[#0C0F14]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
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
              India's smart EV two-wheeler parts platform. Quality components for every build.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#6B6B78] font-semibold mb-1">Quick Links</h4>
            <Link to="/" className="text-sm text-[#8B8B96] hover:text-[#E8E8ED] transition-colors">Home</Link>
            <Link to="/products" className="text-sm text-[#8B8B96] hover:text-[#E8E8ED] transition-colors">All Parts</Link>
          </div>

          {/* Contact / Support */}
          <div className="flex flex-col gap-3" data-testid="footer-contact">
            <h4 className="text-xs uppercase tracking-[0.15em] text-[#6B6B78] font-semibold mb-1">Customer Support</h4>
            <a href="tel:+918707259761" className="flex items-center gap-2 text-sm text-[#00FF9D] hover:text-[#33FFB3] transition-colors font-medium">
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
              +91 8707259761
            </a>
            <a href="mailto:support@himprash.in" className="flex items-center gap-2 text-sm text-[#8B8B96] hover:text-[#E8E8ED] transition-colors">
              <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
              support@himprash.in
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#6B6B78]">
            &copy; {new Date().getFullYear()} HimPrash. All rights reserved.
          </p>
          <p className="text-xs text-[#6B6B78]">
            Made in India for EV builders
          </p>
        </div>
      </div>
    </footer>
  );
}
