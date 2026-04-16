import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ShoppingCart, Check, ChevronRight } from "lucide-react";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    toast.success(`${product.name} added to cart`, {
      description: "Cart functionality coming soon!",
      duration: 3000,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#111315] border border-[#1E2328] h-96 md:h-[600px] animate-pulse" />
            <div className="space-y-6">
              <div className="h-4 w-24 bg-[#1A1D21] animate-pulse" />
              <div className="h-10 w-3/4 bg-[#1A1D21] animate-pulse" />
              <div className="h-8 w-32 bg-[#1A1D21] animate-pulse" />
              <div className="h-24 w-full bg-[#1A1D21] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-[#A1A1AA] mb-4">Product not found</p>
          <Link
            to="/products"
            className="text-sm text-[#0A84FF] hover:text-[#339DFF] transition-colors"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="product-detail-page" className="min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111315',
            border: '1px solid #1E2328',
            color: '#F5F5F7',
          },
        }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#1E2328]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              data-testid="breadcrumb-home"
              className="text-[#71717A] hover:text-[#A1A1AA] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#71717A]" strokeWidth={1.5} />
            <Link
              to="/products"
              data-testid="breadcrumb-products"
              className="text-[#71717A] hover:text-[#A1A1AA] transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#71717A]" strokeWidth={1.5} />
            <span className="text-[#A1A1AA]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Image - Sticky on desktop */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="bg-[#111315] border border-[#1E2328] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                data-testid="product-detail-image"
                className="w-full h-80 md:h-[540px] object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A84FF] mb-4">
              {product.category}
            </p>

            {/* Name */}
            <h1
              data-testid="product-detail-name"
              className="text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium text-[#F5F5F7] mb-6"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <p
              data-testid="product-detail-price"
              className="text-2xl font-semibold text-[#F5F5F7] mb-6"
            >
              ${product.price.toFixed(2)}
            </p>

            {/* Stock */}
            {product.in_stock ? (
              <div
                data-testid="product-detail-stock"
                className="inline-flex items-center gap-2 bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/20 px-4 py-1.5 text-xs uppercase tracking-widest font-medium w-fit mb-8"
              >
                <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                In Stock
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 text-xs uppercase tracking-widest font-medium w-fit mb-8">
                Out of Stock
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.15em] text-[#71717A] font-medium mb-3">
                Description
              </h3>
              <p
                data-testid="product-detail-description"
                className="text-base leading-relaxed text-[#A1A1AA]"
              >
                {product.description}
              </p>
            </div>

            {/* Compatibility */}
            <div className="mb-10">
              <h3 className="text-xs uppercase tracking-[0.15em] text-[#71717A] font-medium mb-3">
                Compatibility
              </h3>
              <div
                data-testid="product-detail-compatibility"
                className="inline-flex bg-[#1A1D21] border border-[#1E2328] px-4 py-2.5 text-sm text-[#F5F5F7]"
              >
                {product.compatibility}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              data-testid="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`flex items-center justify-center gap-3 w-full px-8 py-4 font-medium text-base transition-all duration-200 ${
                addedToCart
                  ? 'bg-[#00FF9D] text-[#0B0B0B]'
                  : product.in_stock
                    ? 'bg-[#0A84FF] text-white hover:bg-[#339DFF]'
                    : 'bg-[#1A1D21] text-[#71717A] cursor-not-allowed'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" strokeWidth={1.5} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                  {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </button>

            {/* Back link */}
            <Link
              to="/products"
              data-testid="back-to-products"
              className="flex items-center gap-2 mt-8 text-sm text-[#A1A1AA] hover:text-[#0A84FF] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
              Back to all products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
