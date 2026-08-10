"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCartOpen } from "@/features/cart/cartSlice";
import { toast } from "sonner";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import "./product-details.css";

const WHATSAPP_NUMBER = "8801531532139";

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const slug = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantityModal, setQuantityModal] = useState(false);
  const [modalQty, setModalQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (!slug) return;
    try {
      const cached = sessionStorage.getItem(`product_${slug}`);
      if (cached) {
        setProduct(JSON.parse(cached));
        sessionStorage.removeItem(`product_${slug}`);
        setLoading(false);
        return;
      }
    } catch { }

    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/products/${slug}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setProduct(json.data);
            setLoading(false);
            return;
          }
        }
        const allRes = await fetch("/api/products", { cache: "no-store" });
        if (allRes.ok) {
          const allJson = await allRes.json();
          const allProducts = allJson?.data || [];

          const slugify = (text) => {
            if (!text) return "";
            return String(text)
              .toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, "")
              .replace(/[\s_-]+/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-+|-+$/g, "");
          };

          const lowerSlug = slug.toLowerCase();
          const normSlug = slugify(slug);

          const matched = allProducts.find((p) => {
            const pId = String(p._id || p.id || "");
            const pSlugRaw = p.slug ? String(p.slug).toLowerCase() : "";
            const pSlugNorm = p.slug ? slugify(p.slug) : "";
            const pNameSlug = p.name ? slugify(p.name) : "";

            return (
              pId === slug ||
              pSlugRaw === lowerSlug ||
              (pSlugNorm && pSlugNorm !== "-" && pSlugNorm === normSlug) ||
              (pNameSlug && pNameSlug === normSlug) ||
              (pNameSlug && pNameSlug === lowerSlug)
            );
          });
          if (matched) {
            setProduct(matched);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Error loading product details:", err);
      }
      setProduct(null);
      setNotFound(true);
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="product-page">
          <div
            className="container"
            style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}
          >
            <p style={{ color: "#888", fontSize: 16 }}>Loading product...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !product) {
    return (
      <>
        <Header />
        <div className="product-page">
          <div
            className="container"
            style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}
          >
            <h2 style={{ fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 16 }}>
              Product Not Found
            </h2>
            <p style={{ color: "#666", fontSize: 16, marginBottom: 24 }}>
              The product you are looking for does not exist or has been removed.
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                backgroundColor: "#76B432",
                color: "#ffffff",
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Back to Home
            </button>
          </div>
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

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const baseSalePrice = product?.salePrice ?? product?.price ?? product?.sale_price ?? 0;
  const basePurchasePrice = product?.purchasePrice ?? product?.purchase_price ?? 0;

  const displayPrice = selectedVariant
    ? (selectedVariant.salePrice ?? selectedVariant.price ?? baseSalePrice)
    : baseSalePrice;

  const oldPrice = selectedVariant
    ? (selectedVariant.purchasePrice ?? basePurchasePrice)
    : basePurchasePrice;

  const inStock = selectedVariant
    ? Number(selectedVariant.currentStock ?? 1) > 0
    : Number(product?.currentStock ?? product?.stockQuantity ?? product?.stock ?? 1) > 0;

  const discount =
    oldPrice > displayPrice
      ? Math.round(((oldPrice - displayPrice) / oldPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("অনুগ্রহ করে একটি ভ্যারিয়েন্ট সিলেক্ট করুন (Please select a variant).");
      return;
    }
    if (!inStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    const productId = product._id || product.id;
    const cartItemId = selectedVariant
      ? `${productId}_${selectedVariant.variantId || selectedVariant._id}`
      : productId;

    dispatch(
      addToCart({
        productId,
        quantity,
        price: displayPrice,
        total: displayPrice * quantity,
        product: {
          id: productId,
          name: product.name,
          slug: product.slug,
          price: displayPrice,
          images: images,
          description: product.description || "",
        },
        id: cartItemId,
        name: product.name,
        variantId: selectedVariant?.variantId || null,
        variantName: selectedVariant?.name || null,
        sku: selectedVariant?.sku || product.sku || null,
        slug: product.slug,
        image: images[0],
      })
    );
    toast.success(`${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''} added to cart!`);
  };

  const handleBuyNow = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("অনুগ্রহ করে একটি ভ্যারিয়েন্ট সিলেক্ট করুন (Please select a variant).");
      return;
    }
    if (!inStock) return;

    const productId = product._id || product.id;
    const cartItemId = selectedVariant
      ? `${productId}_${selectedVariant.variantId || selectedVariant._id}`
      : productId;

    const exists = cartItems.find(
      (item) => item.id === cartItemId
    );
    if (exists) {
      setModalQty(exists.quantity);
      setQuantityModal(true);
      return;
    }
    handleAddToCart();
    dispatch(setCartOpen(true));
  };

  const handleModalUpdate = () => {
    const productId = product._id || product.id;
    const cartItemId = selectedVariant
      ? `${productId}_${selectedVariant.variantId || selectedVariant._id}`
      : productId;

    dispatch(
      addToCart({
        productId,
        quantity: modalQty,
        price: displayPrice,
        total: displayPrice * modalQty,
        product: {
          id: productId,
          name: product.name,
          slug: product.slug,
          price: displayPrice,
          images: images,
          description: product.description || "",
        },
        id: cartItemId,
        name: product.name,
        variantId: selectedVariant?.variantId || null,
        variantName: selectedVariant?.name || null,
        sku: selectedVariant?.sku || product.sku || null,
        slug: product.slug,
        image: images[0],
      })
    );
    setQuantityModal(false);
    dispatch(setCartOpen(true));
  };

  const handleWhatsApp = () => {
    const variantText = selectedVariant ? ` (${selectedVariant.name})` : "";
    const msg = encodeURIComponent(
      `Hi! I want to order: ${product.name}${variantText} (Qty: ${quantity}) - ৳${displayPrice}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const categoryName = product.category?.name || product.categoryName || "";

  console.log(product)

  return (
    <>
      <Header />
      <div className="product-page">
        <div className="container">
          <div className="breadcrumb">
            <span className="breadcrumb-link" onClick={() => router.push("/")}>
              Home
            </span>
            <span className="breadcrumb-sep">/</span>
            {categoryName && (
              <>
                <span className="breadcrumb-link">{categoryName}</span>
                <span className="breadcrumb-sep">/</span>
              </>
            )}
            <span className="breadcrumb-current">{product.name}</span>
          </div>

          <div className="product-grid">
            <div className="gallery-col">
              <div className="main-image-wrap">
                {discount > 0 && (
                  <div className="sale-badge">-{discount}% SALE</div>
                )}
                <Image
                  src={
                    images[activeThumb]?.startsWith("http") ||
                      images[activeThumb]?.startsWith("data:")
                      ? images[activeThumb]
                      : `/images/${images[activeThumb]}`
                  }
                  alt={product.name}
                  className="main-image"
                  width={500}
                  height={500}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                  }}
                  priority
                  unoptimized={
                    images[activeThumb]?.startsWith("data:") ||
                    images[activeThumb]?.startsWith("http")
                  }
                />
              </div>
              {images.length > 1 && (
                <div className="thumb-row">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={`thumb-btn ${activeThumb === i ? "active" : ""
                        }`}
                    >
                      <Image
                        src={
                          src.startsWith("http") || src.startsWith("data:")
                            ? src
                            : `/images/${src}`
                        }
                        alt={`Thumb ${i + 1}`}
                        className="thumb-img"
                        width={100}
                        height={100}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                        unoptimized={
                          src.startsWith("data:") || src.startsWith("http")
                        }
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="info-col">
              <h1 className="product-title" style={{ color: "#76B432" }}>{product.name}</h1>

              <div className="meta-row">
                <span
                  className={`in-stock`}
                  style={{ color: inStock ? "#76B432" : "#e53935" }}
                >
                  ● {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="price-row">
                <span className="current-price">৳{displayPrice}</span>
                {oldPrice > displayPrice && (
                  <>
                    <span className="old-price">৳{oldPrice}</span>
                    <span className="save-badge">Save {discount}%</span>
                  </>
                )}
              </div>

              {hasVariants && (
                <div className="my-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="mb-2.5 flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      Select Variant <span className="text-red-500">*</span>
                    </label>
                    {selectedVariant ? (
                      <span className="text-xs font-semibold text-[#76B432]">
                        Selected: {selectedVariant.name}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Selection required
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.variantId === v.variantId || selectedVariant?._id === v._id;
                      const vPrice = v.salePrice ?? v.price ?? displayPrice;
                      const vStock = Number(v.currentStock ?? 1);
                      const isVStockOut = vStock <= 0;

                      return (
                        <button
                          key={v.variantId || v._id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          disabled={isVStockOut}
                          className={`relative flex flex-col items-center px-2 py-1 rounded border text-sm font-medium transition-all duration-200 cursor-pointer ${isSelected
                            ? "border-[#76B432] bg-white text-[#76B432] shadow-sm ring-2 ring-[#76B432]/30 font-bold dark:bg-slate-800 dark:text-[#76B432]"
                            : isVStockOut
                              ? "border-slate-200 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900"
                              : "border-slate-200 bg-white text-slate-800 hover:border-[#76B432]/50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            }`}
                        >
                          <span className="text-sm font-semibold">{v.name}</span>

                          {isVStockOut && (
                            <span className="text-[10px] text-red-500 font-normal">Out of stock</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.description && (
                <p className="description">{product.description}</p>
              )}

              <div className="qty-row">
                <span className="qty-label">Quantity:</span>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-row">
                <button
                  className="buy-btn"
                  onClick={handleBuyNow}
                  disabled={!inStock}
                >
                  Buy Now
                </button>
              </div>

              <div className="social-row">
                <button
                  className="whatsapp-btn"
                  style={{ backgroundColor: "#76B432", color: "#ffffff", border: "none" }}
                  onClick={handleWhatsApp}
                >
                  <span>💬</span> হোয়াটসঅ্যাপে অর্ডার করুন
                </button>
              </div>

              {categoryName && (
                <div className="category-row">
                  <span className="category-label">Categories:</span>
                  <span className="category-tag">{categoryName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
              {["description", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-6 py-4 text-sm font-bold capitalize transition-all duration-200 sm:px-10 sm:text-base cursor-pointer ${activeTab === tab
                    ? "border-b-2 border-[#76B432] bg-white text-[#76B432] dark:bg-slate-900 dark:text-[#76B432]"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    }`}
                >
                  {tab === "description" ? "Description" : "Reviews"}
                </button>
              ))}
            </div>

            {/* Tabs Content */}
            <div className="p-6 md:p-10">
              {activeTab === "description" && (
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                    Product Details
                  </h3>
                  <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
                    {product.description || "No description available."}
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-base font-medium text-slate-600 dark:text-slate-400">
                    কোনো রিভিউ এখনো যোগ করা হয়নি।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {quantityModal && (
        <div className="modal-overlay" onClick={() => setQuantityModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setQuantityModal(false)}
            >
              ✕
            </button>
            <h3 className="modal-title">{product.name}</h3>
            <p className="modal-subtitle">Adjust quantity</p>
            <div className="modal-qty">
              <button
                className="qty-btn"
                onClick={() => setModalQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="qty-value">{modalQty}</span>
              <button
                className="qty-btn"
                onClick={() => setModalQty((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button className="modal-update-btn" onClick={handleModalUpdate}>
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