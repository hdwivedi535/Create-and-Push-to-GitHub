import { useState, useEffect } from "react";
import axios from "axios";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Headphones } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API}/products?featured=true`);
        setFeatured(res.data);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const perks = [
    { icon: ShieldCheck, title: "Premium Quality", desc: "Rigorously tested for durability and performance" },
    { icon: Truck, title: "Fast Shipping", desc: "Free delivery on orders over $100" },
    { icon: Headphones, title: "Expert Support", desc: "EV specialists ready to help you choose" },
  ];

  return (
    <div data-testid="home-page">
      <HeroSection />

      {/* Perks Section */}
      <section className="border-y border-[#1E2328] bg-[#111315]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#0A84FF]/10 flex items-center justify-center flex-shrink-0">
                  <perk.icon className="w-5 h-5 text-[#0A84FF]" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#F5F5F7] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {perk.title}
                  </h4>
                  <p className="text-xs text-[#71717A]">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section data-testid="featured-section" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A84FF] mb-3">
                Featured
              </p>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl tracking-tight font-medium text-[#F5F5F7]"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Top Picks for Your EV
              </h2>
            </div>
            <Link
              to="/products"
              data-testid="view-all-products"
              className="hidden md:flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-[#0A84FF] transition-colors group"
            >
              View all
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Product Grid - Bento Layout */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`bg-[#111315] border border-[#1E2328] animate-pulse ${
                    i === 0 ? 'md:col-span-8 h-72 md:h-96' : 'md:col-span-4 h-64'
                  }`}
                />
              ))}
            </div>
          ) : (
            <>
              {/* Bento grid: first item large, rest normal */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                {featured.slice(0, 1).map((product, i) => (
                  <div key={product.id} className="md:col-span-8">
                    <ProductCard product={product} index={i} large />
                  </div>
                ))}
                <div className="md:col-span-4 flex flex-col gap-6">
                  {featured.slice(1, 3).map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i + 1} />
                  ))}
                </div>
              </div>

              {/* Rest of featured */}
              {featured.length > 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.slice(3).map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i + 3} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Mobile view all */}
          <div className="mt-10 md:hidden text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-[#0A84FF] hover:text-[#339DFF] transition-colors"
            >
              View all products
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
