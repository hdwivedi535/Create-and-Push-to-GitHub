import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

export default function FilterSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceChange,
  maxPrice,
  onClearFilters,
  mobileOpen,
  onMobileClose,
}) {
  const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        data-testid="filter-sidebar"
        className={`
          fixed lg:relative top-0 left-0 h-full lg:h-auto z-50 lg:z-0
          w-72 lg:w-full bg-[#111315] lg:bg-transparent border-r lg:border-r-0 border-[#1E2328]
          transition-transform duration-300 lg:transition-none
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto lg:overflow-visible
          pt-20 lg:pt-0 px-6 lg:px-0
        `}
      >
        {/* Mobile close */}
        <button
          data-testid="filter-mobile-close"
          className="lg:hidden absolute top-6 right-6 text-[#A1A1AA] hover:text-[#F5F5F7]"
          onClick={onMobileClose}
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3
            className="text-sm uppercase tracking-[0.15em] font-semibold text-[#F5F5F7]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              data-testid="clear-filters-btn"
              onClick={onClearFilters}
              className="text-xs text-[#0A84FF] hover:text-[#339DFF] transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h4 className="text-xs uppercase tracking-[0.15em] text-[#71717A] font-medium mb-4">
            Category
          </h4>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <label
                key={cat}
                data-testid={`filter-category-${cat.toLowerCase()}`}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <Checkbox
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => onCategoryChange(cat)}
                  className="border-[#1E2328] data-[state=checked]:bg-[#0A84FF] data-[state=checked]:border-[#0A84FF]"
                />
                <span className="text-sm text-[#A1A1AA] group-hover:text-[#F5F5F7] transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h4 className="text-xs uppercase tracking-[0.15em] text-[#71717A] font-medium mb-4">
            Price Range
          </h4>
          <div className="px-1">
            <Slider
              data-testid="filter-price-slider"
              min={0}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueChange={onPriceChange}
              className="mb-4 [&_[role=slider]]:bg-[#0A84FF] [&_[role=slider]]:border-[#0A84FF] [&_[data-orientation=horizontal]>[data-orientation=horizontal]]:bg-[#0A84FF]"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#A1A1AA]">${priceRange[0]}</span>
              <span className="text-[#A1A1AA]">${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
