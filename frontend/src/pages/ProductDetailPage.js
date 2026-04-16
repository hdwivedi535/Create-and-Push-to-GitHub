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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

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
            <div className="bg-[#161B22] border border-[#1F2937] h-96 md:h-[600px] rounded-lg animate-pulse" />
            <div className="space-y-6">
              <div className="h-4 w-24 bg-[#1C2230] rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-[#1C2230] rounded animate-pulse" />
              <div className="h-8 w-32 bg-[#1C2230] rounded animate-pulse" />
              <div className="h-24 w-full bg-[#1C2230] rounded animate-pulse" />
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
          <p className="text-xl text-[#A0A0AB] mb-4">Product not found</p>
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
            background: '#161B22',
            border: '1px solid #1F2937',
            color: '#E8E8ED',
          },
        }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              data-testid="breadcrumb-home"
              className="text-[#6B6B78] hover:text-[#A0A0AB] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B6B78]" strokeWidth={1.5} />
            <Link
              to="/products"
              data-testid="breadcrumb-products"
              className="text-[#6B6B78] hover:text-[#A0A0AB] transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B6B78]" strokeWidth={1.5} />
            <span className="text-[#A0A0AB]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Image - Sticky on desktop */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="bg-[#161B22] border border-[#1F2937] overflow-hidden rounded-lg">
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
              className="text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium text-[#E8E8ED] mb-6"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <p
              data-testid="product-detail-price"
              className="text-3xl font-bold text-white mb-6"
            >
              <span className="text-[#00FF9D] text-xl mr-1">&#8377;</span>
              {formatPrice(product.price)}
            </p>

            {/* Stock */}
            {product.in_stock ? (
              <div
                data-testid="product-detail-stock"
                className="inline-flex items-center gap-2 bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/25 px-4 py-2 text-xs uppercase tracking-widest font-bold w-fit mb-8 rounded-sm"
              >
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                In Stock
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-red-500/15 text-red-400 border border-red-500/25 px-4 py-2 text-xs uppercase tracking-widest font-bold w-fit mb-8 rounded-sm">
                Out of Stock
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.15em] text-[#6B6B78] font-medium mb-3">
                Description
              </h3>
              <p
                data-testid="product-detail-description"
                className="text-base leading-relaxed text-[#A0A0AB]"
              >
                {product.description}
              </p>
            </div>

            {/* Compatibility */}
            <div className="mb-10">
              <h3 className="text-xs uppercase tracking-[0.15em] text-[#6B6B78] font-medium mb-3">
                Compatibility
              </h3>
              <div
                data-testid="product-detail-compatibility"
                className="inline-flex bg-[#1C2230] border border-[#1F2937] px-4 py-2.5 text-sm text-[#E8E8ED] rounded-md"
              >
                {product.compatibility}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              data-testid="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`flex items-center justify-center gap-3 w-full px-8 py-4 font-semibold text-base transition-all duration-200 rounded-md ${
                addedToCart
                  ? 'bg-[#00FF9D] text-[#0E1117] shadow-lg shadow-[#00FF9D]/20'
                  : product.in_stock
                    ? 'bg-[#0A84FF] text-white hover:bg-[#339DFF] shadow-lg shadow-[#0A84FF]/20 hover:shadow-[#0A84FF]/40'
                    : 'bg-[#1C2230] text-[#6B6B78] cursor-not-allowed'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="w-5 h-5" strokeWidth={2} />
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
              className="flex items-center gap-2 mt-8 text-sm text-[#8B8B96] hover:text-[#0A84FF] transition-colors group font-medium"
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
