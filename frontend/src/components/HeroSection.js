import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1775406854981-02ad2360604c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxlbGVjdHJpYyUyMHNjb290ZXIlMjByaWRlciUyMHVyYmFuJTIwY2l0eSUyMGJyaWdodCUyMGRheXRpbWV8ZW58MHx8fHwxNzc2MzQ5MjgwfDA&ixlib=rb-4.1.0&q=85"
          alt="Electric scooter rider in urban city"
          className="w-full h-full object-cover"
        />
        {/* Refined gradient - less black, more subtle */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1117]/95 via-[#0E1117]/70 to-[#0E1117]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1117] via-transparent to-[#0E1117]/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-2xl">
          {/* Label */}
          <div
            data-testid="hero-label"
            className="inline-flex items-center gap-2 bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/25 px-4 py-2 text-xs uppercase tracking-[0.2em] font-semibold mb-8 rounded-sm"
          >
            <Zap className="w-3.5 h-3.5" strokeWidth={2} />
            2W EV Accessories
          </div>

          {/* Heading */}
          <h1
            data-testid="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-semibold text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            HimPrash
          </h1>

          {/* Subheading */}
          <p
            data-testid="hero-subheading"
            className="text-base md:text-lg text-[#C4C4CC] leading-relaxed mb-10 max-w-lg"
          >
            Smart EV Accessories Platform built by real users, for real users.
            Premium quality accessories for your electric two-wheeler.
          </p>

          {/* CTA */}
          <Link
            to="/products"
            data-testid="hero-cta"
            className="inline-flex items-center gap-3 bg-[#0A84FF] text-white hover:bg-[#339DFF] px-10 py-4 font-semibold text-base transition-all duration-200 group rounded-sm shadow-lg shadow-[#0A84FF]/20 hover:shadow-[#0A84FF]/40"
          >
            Explore Products
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
