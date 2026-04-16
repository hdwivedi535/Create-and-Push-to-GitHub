import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://static.prod-images.emergentagent.com/jobs/62773f05-d118-4c48-9ad3-b551fc41c456/images/0e711f7f36f04431cf20dc4af208ae9ad0c88ad4ad1a2ca0c8fa3e76dabd4620.png"
          alt="Premium EV interior"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-2xl">
          {/* Label */}
          <div
            data-testid="hero-label"
            className="inline-flex items-center gap-2 bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] font-medium mb-8"
          >
            Smart EV Accessories
          </div>

          {/* Heading */}
          <h1
            data-testid="hero-heading"
            className="text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium text-[#F5F5F7] mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            HimPrash
          </h1>

          {/* Subheading */}
          <p
            data-testid="hero-subheading"
            className="text-base md:text-lg text-[#A1A1AA] leading-relaxed mb-10 max-w-lg"
          >
            Smart EV Accessories Platform built by real users, for real users.
            Premium quality, engineered for the modern electric vehicle owner.
          </p>

          {/* CTA */}
          <Link
            to="/products"
            data-testid="hero-cta"
            className="inline-flex items-center gap-3 bg-[#0A84FF] text-white hover:bg-[#339DFF] px-8 py-4 font-medium transition-colors duration-200 group"
          >
            Explore Products
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
