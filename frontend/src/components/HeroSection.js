import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* Background Image - bright EV scooter */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1772057592150-fc5d5b6ec357?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBFViUyMGJyaWdodCUyMGNsZWFuJTIwcHJvZHVjdHxlbnwwfHx8fDE3NzYzNTA2MDV8MA&ixlib=rb-4.1.0&q=85"
          alt="Electric scooter parked on urban sidewalk"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Lighter overlay - keeps image visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1117]/90 via-[#0E1117]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1117]/80 via-transparent to-[#0E1117]/10" />
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
            EV Two-Wheeler Parts
          </div>

          {/* Heading */}
          <h1
            data-testid="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-semibold text-white mb-4 drop-shadow-lg"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            HimPrash
          </h1>

          {/* Subheading */}
          <p
            data-testid="hero-subheading"
            className="text-base md:text-lg text-[#D4D4DC] leading-relaxed mb-10 max-w-lg drop-shadow-md"
          >
            Smart EV Parts Platform built for electric two-wheeler users in India
          </p>

          {/* CTA */}
          <Link
            to="/products"
            data-testid="hero-cta"
            className="inline-flex items-center gap-3 bg-[#0A84FF] text-white hover:bg-[#339DFF] px-10 py-4 font-semibold text-base transition-all duration-200 group rounded-md shadow-lg shadow-[#0A84FF]/25 hover:shadow-[#0A84FF]/40"
          >
            Explore Parts
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
