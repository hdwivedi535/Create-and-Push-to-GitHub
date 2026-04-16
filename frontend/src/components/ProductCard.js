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
      className="group bg-[#161B22] border border-[#1F2937] rounded-lg transition-all duration-300 hover:border-[#0A84FF]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0A84FF]/5 flex flex-col overflow-hidden"
      style={{ animationDelay: `${index * 50}ms`, animation: 'fadeInUp 0.4s ease-out forwards', opacity: 0 }}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-[#1A1F28] ${large ? 'h-72 md:h-80' : 'h-48 md:h-56'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161B22]/40 via-transparent to-transparent" />
        {product.in_stock ? (
          <div
            data-testid={`stock-badge-${product.id}`}
            className="absolute top-3 right-3 bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm backdrop-blur-sm"
          >
            In Stock
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm backdrop-blur-sm">
            Out of Stock
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#0A84FF] font-semibold mb-1.5">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-[#E8E8ED] mb-2 group-hover:text-white transition-colors duration-200 leading-snug line-clamp-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-[#1F2937]/60">
          <span className="text-lg font-bold text-white">
            <span className="text-[#00FF9D] text-xs font-semibold mr-0.5">&#8377;</span>
            {formatPrice(product.price)}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-[#8B8B96] group-hover:text-[#0A84FF] transition-colors duration-200">
            View
            <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
