import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeroSection from "@/components/HeroSection";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, Battery, Cpu, Settings, BatteryCharging, CircuitBoard, Cable } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORY_ICONS = {
  Battery: Battery,
  Motor: Settings,
  Controller: Cpu,
  Charger: BatteryCharging,
  "Battery Management System (BMS)": CircuitBoard,
  Wiring: Cable,
};

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, catsRes] = await Promise.all([
          axios.get(`${API}/products?featured=true`),
          axios.get(`${API}/categories`),
        ]);
        setFeatured(productsRes.data);
        setCategories(catsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleCategorySelect = (cat) => {
    if (cat) {
      navigate(`/products?category=${encodeURIComponent(cat)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <div data-testid="home-page">
      <HeroSection />

      {/* Search bar */}
      <SearchBar onSearch={handleSearch} onCategorySelect={handleCategorySelect} />

      {/* Category Quick Access */}
      <section data-testid="category-quick-access" className="bg-[#0E1117] py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A84FF] mb-5 text-center">
            Browse by Category
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Settings;
              return (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  data-testid={`category-btn-${cat.toLowerCase()}`}
                  className="flex items-center gap-2 bg-[#161B22] border border-[#1F2937] text-[#A0A0AB] hover:text-white hover:border-[#0A84FF]/50 hover:bg-[#1A2030] px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section data-testid="featured-section" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A84FF] mb-3">
                Featured
              </p>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl tracking-tight font-medium text-[#E8E8ED]"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Top EV Parts
              </h2>
            </div>
            <Link
              to="/products"
              data-testid="view-all-products"
              className="hidden md:flex items-center gap-2 text-sm text-[#8B8B96] hover:text-[#0A84FF] transition-colors group font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#161B22] border border-[#1F2937] h-80 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {/* Mobile view all */}
          <div className="mt-8 md:hidden text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-[#0A84FF] hover:text-[#339DFF] transition-colors font-medium"
            >
              View all parts
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
