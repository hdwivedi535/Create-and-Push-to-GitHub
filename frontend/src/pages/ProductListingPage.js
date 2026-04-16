import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import { SlidersHorizontal } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const MAX_PRICE = 5000;

export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (priceRange[0] > 0) params.append("min_price", priceRange[0]);
        if (priceRange[1] < MAX_PRICE) params.append("max_price", priceRange[1]);

        if (selectedCategories.length > 0) {
          const requests = selectedCategories.map((cat) => {
            const catParams = new URLSearchParams(params);
            catParams.append("category", cat);
            return axios.get(`${API}/products?${catParams.toString()}`);
          });
          const responses = await Promise.all(requests);
          const merged = responses.flatMap((r) => r.data);
          setProducts(merged);
        } else {
          const res = await axios.get(`${API}/products?${params.toString()}`);
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategories, priceRange]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, MAX_PRICE]);
  };

  return (
    <div data-testid="product-listing-page" className="min-h-screen">
      {/* Page header */}
      <div className="border-b border-[#1F2937] bg-[#131820]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A84FF] mb-3">
            Collection
          </p>
          <h1
            data-testid="listing-heading"
            className="text-4xl sm:text-5xl tracking-tighter font-medium text-[#E8E8ED]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            All Products
          </h1>
          <p className="text-base text-[#8B8B96] mt-3">
            Browse our complete range of 2W EV accessories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Mobile filter toggle */}
        <button
          data-testid="mobile-filter-toggle"
          className="lg:hidden flex items-center gap-2 text-sm text-[#A0A0AB] hover:text-[#E8E8ED] border border-[#1F2937] px-4 py-2.5 mb-8 transition-colors rounded-md"
          onClick={() => setMobileFilterOpen(true)}
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
          Filters
          {selectedCategories.length > 0 && (
            <span className="bg-[#0A84FF] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ml-1">
              {selectedCategories.length}
            </span>
          )}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              maxPrice={MAX_PRICE}
              onClearFilters={handleClearFilters}
              mobileOpen={mobileFilterOpen}
              onMobileClose={() => setMobileFilterOpen(false)}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[#6B6B78]">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#161B22] border border-[#1F2937] h-80 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div data-testid="no-products-message" className="text-center py-20">
                <p className="text-lg text-[#A0A0AB] mb-2">No products found</p>
                <p className="text-sm text-[#6B6B78]">Try adjusting your filters</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-sm text-[#0A84FF] hover:text-[#339DFF] transition-colors font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
