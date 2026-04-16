import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function ProductCard({ product, index = 0, large = false }) {
  return (
    <Link
      to={`/products/${product.id}`}
      data-testid={`product-card-${product.id}`}
      className={`group bg-[#111315] border border-[#1E2328] transition-all duration-300 hover:border-[#339DFF]/50 hover:-translate-y-1 flex flex-col animate-fade-in-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-[#0B0B0B] ${large ? 'h-72 md:h-96' : 'h-52 md:h-64'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Stock badge */}
        {product.in_stock ? (
          <div
            data-testid={`stock-badge-${product.id}`}
            className="absolute top-3 right-3 bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/20 px-3 py-1 text-xs uppercase tracking-widest font-medium"
          >
            In Stock
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 text-xs uppercase tracking-widest font-medium">
            Out of Stock
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs uppercase tracking-[0.15em] text-[#0A84FF] font-medium mb-2">
          {product.category}
        </p>
        <h3 className="text-base font-medium text-[#F5F5F7] mb-2 group-hover:text-[#339DFF] transition-colors duration-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-semibold text-[#F5F5F7]">
            ${product.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#A1A1AA] group-hover:text-[#0A84FF] transition-colors duration-200">
            View Details
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
