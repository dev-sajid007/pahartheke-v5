"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCartOpen } from "@/features/cart/cartSlice";
import { toast } from "sonner";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { CONTACT } from "@/config/contact";

const WHATSAPP_NUMBER = CONTACT.whatsapp;

function resolveImage(src) {
  if (!src) return "https://placehold.co/500x500/e8f5e9/2d6a4f?text=Product";
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  return `/images/${src.replace(/^\//, "")}`;
}

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const slug = params?.id;
  const fetchedSlug = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantityModal, setQuantityModal] = useState(false);
  const [modalQty, setModalQty] = useState(1);

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (!slug) return;
    if (fetchedSlug.current === slug) return;
    fetchedSlug.current = slug;

    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      try {
        const res = await fetch(`/api/products/${slug}`, { cache: "no-store" });
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          setProduct(json.data);
        } else {
          toast.error(json.error || "Product not found.");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast.error("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
          <div className="h-10 w-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
          <p className="text-gray-500 text-lg">Product not found.</p>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : ["https://placehold.co/500x500/e8f5e9/2d6a4f?text=Product"];

  const displayPrice = product?.salePrice ?? product?.price ?? product?.sale_price ?? 0;
  const oldPriceVal = product?.oldPrice ?? product?.purchasePrice ?? product?.purchase_price ?? 0;
  const hasDiscount = oldPriceVal > displayPrice;
  const discountPercent = hasDiscount ? Math.round((1 - displayPrice / oldPriceVal) * 100) : 0;
  const inStock = Number(product?.currentStock ?? product?.stockQuantity ?? product?.stock ?? 0) > 0;

  const cartItemPayload = {
    id: product._id || product.id,
    name: product.name,
    price: displayPrice,
    image: resolveImage(images[0]),
    quantity,
    slug: product.slug,
  };

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error("This product is currently out of stock.");
      return;
    }
    dispatch(addToCart(cartItemPayload));
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    const productId = product._id || product.id;
    const exists = cartItems.find((item) => item.id === productId);
    if (exists) {
      setModalQty(exists.quantity);
      setQuantityModal(true);
      return;
    }
    handleAddToCart();
    dispatch(setCartOpen(true));
  };

  const handleModalUpdate = () => {
    dispatch(addToCart({ ...cartItemPayload, quantity: modalQty }));
    setQuantityModal(false);
    dispatch(setCartOpen(true));
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I want to order: ${product.name} (Qty: ${quantity}) - ৳${displayPrice}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:+${WHATSAPP_NUMBER}`;
  };

  const categoryName = product.category?.name || product.categoryName || "";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f7f7f7] text-[#222]">
        <div className="max-w-[1100px] mx-auto px-4 py-6">
          <div className="text-sm text-gray-500 mb-5 flex items-center gap-1.5 flex-wrap">
            <button onClick={() => router.push("/")} className="text-[#2d6a4f] underline cursor-pointer">Home</button>
            <span className="text-gray-300">/</span>
            {categoryName && (
              <>
                <span className="text-[#2d6a4f]">{categoryName}</span>
                <span className="text-gray-300">/</span>
              </>
            )}
            <span className="text-gray-600">{product.name}</span>
          </div>

          <div className="flex flex-wrap gap-10 bg-white rounded-xl p-8 shadow-sm md:flex-nowrap">
            <div className="w-full md:w-[340px] shrink-0">
              <div className="relative rounded-lg overflow-hidden bg-[#f0f7f0] mb-3">
                {hasDiscount && (
                  <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                    -{discountPercent}% SALE
                  </div>
                )}
                <img
                  src={resolveImage(images[activeThumb])}
                  alt={product.name}
                  className="w-full h-[340px] object-contain"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={`w-[72px] h-[72px] rounded-lg overflow-hidden border-2 ${activeThumb === i ? "border-[#2d6a4f]" : "border-transparent"} hover:border-[#2d6a4f]`}
                    >
                      <img src={resolveImage(src)} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-[280px]">
              <h1 className="text-[22px] font-bold leading-tight mb-2.5 text-[#1a1a1a]">{product.name}</h1>

              <div className="flex items-center gap-4 mb-2">
                <span className={`text-sm font-semibold ${inStock ? "text-green-600" : "text-red-600"}`}>
                  ● {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3.5">
                <span className="text-[28px] font-bold text-red-600">৳{displayPrice}</span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-gray-400 line-through">৳{oldPriceVal}</span>
                    <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">Save {discountPercent}%</span>
                  </>
                )}
              </div>

              {product.description && (
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{product.description}</p>
              )}

              <div className="flex items-center gap-3.5 mb-4.5">
                <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 bg-gray-100 text-lg cursor-pointer hover:bg-gray-200 border-r border-gray-300">−</button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="w-9 h-9 bg-gray-100 text-lg cursor-pointer hover:bg-gray-200 border-l border-gray-300">+</button>
                </div>
              </div>

              <div className="flex gap-3 mb-3 flex-wrap">
                <button onClick={handleBuyNow} disabled={!inStock}
                  className="flex-1 min-w-[120px] bg-[#1a3c2b] text-white rounded-lg py-3 text-sm font-bold cursor-pointer hover:bg-[#0f2a1d] disabled:opacity-50 disabled:cursor-not-allowed">
                  Buy Now
                </button>
              </div>

              <div className="flex gap-2.5 mb-4.5 flex-wrap">
                <button onClick={handleWhatsApp}
                  className="flex-1 min-w-[160px] bg-[#25d366] text-white rounded-lg py-2.5 text-xs font-semibold cursor-pointer hover:bg-[#1da851] flex items-center justify-center gap-1.5">
                  <span>💬</span> হোয়াটসঅ্যাপে অর্ডার করুন
                </button>
              </div>

              {categoryName && (
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span className="text-sm text-gray-500">Categories:</span>
                  <span className="bg-green-50 text-[#2d6a4f] text-xs font-semibold px-3 py-1 rounded border border-green-200">{categoryName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-7 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex border-b-2 border-gray-100">
              {["description", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-7 py-3.5 text-sm font-semibold border-b-3 cursor-pointer ${
                    activeTab === tab ? "text-[#e07b2a] border-[#e07b2a]" : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  {tab === "description" ? "Description" : "Reviews"}
                </button>
              ))}
            </div>

            {activeTab === "description" ? (
              <div className="p-7">
                <h3 className="text-base font-bold mb-3.5 text-[#1a1a1a]">Product Details</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description || "No description available."}</p>
              </div>
            ) : (
              <div className="p-7 text-center">
                <p className="text-sm text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {quantityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setQuantityModal(false)}>
          <div className="bg-white rounded-xl p-8 max-w-[360px] w-[90%] text-center relative shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-3 right-3.5 text-gray-500 text-lg cursor-pointer hover:text-gray-800" onClick={() => setQuantityModal(false)}>✕</button>
            <h3 className="text-base font-bold mb-1 text-[#1a1a1a]">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-5">Adjust quantity</p>
            <div className="flex items-center justify-center gap-0 mb-5">
              <button onClick={() => setModalQty((q) => Math.max(1, q - 1))} className="w-10 h-10 border border-gray-300 bg-gray-100 text-lg cursor-pointer">−</button>
              <span className="w-12 text-center text-sm font-semibold border-t border-b border-gray-300 py-2">{modalQty}</span>
              <button onClick={() => setModalQty((q) => q + 1)} className="w-10 h-10 border border-gray-300 bg-gray-100 text-lg cursor-pointer">+</button>
            </div>
            <button onClick={handleModalUpdate} className="w-full bg-[#e07b2a] text-white rounded-lg py-3 text-sm font-bold cursor-pointer hover:bg-[#c96a1f]">
              Update Cart
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProductPage;
