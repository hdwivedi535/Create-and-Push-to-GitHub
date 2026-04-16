import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function ProductCard({ product, index = 0, large = false }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      data-testid={`product-card-${product.id}`}
      className={`group bg-[#161B22] border border-[#1F2937] rounded-lg transition-all duration-300 hover:border-[#0A84FF]/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#0A84FF]/5 flex flex-col animate-fade-in-up overflow-hidden`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-[#1A1F28] ${large ? 'h-72 md:h-96' : 'h-52 md:h-64'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle overlay for better badge visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161B22]/50 via-transparent to-transparent" />
        {/* Stock badge */}
        {product.in_stock ? (
          <div
            data-testid={`stock-badge-${product.id}`}
            className="absolute top-3 right-3 bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-sm backdrop-blur-sm"
          >
            In Stock
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-sm backdrop-blur-sm">
            Out of Stock
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#0A84FF] font-semibold mb-2">
          {product.category}
        </p>
        <h3 className="text-base font-medium text-[#E8E8ED] mb-3 group-hover:text-white transition-colors duration-200 leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#1F2937]/60">
          <span className="text-xl font-bold text-white">
            <span className="text-[#00FF9D] text-sm font-semibold mr-0.5">&#8377;</span>
            {formatPrice(product.price)}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#8B8B96] group-hover:text-[#0A84FF] transition-colors duration-200">
            View
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
