"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCartOpen } from "@/features/cart/cartSlice";
import { toast } from "sonner";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { CONTACT } from "@/config/contact";
import "./product-details.css";

const WHATSAPP_NUMBER = CONTACT.whatsapp;

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const slug = params?.id;

  const [product, setProduct] = useState(() => {
    if (!slug) return null;
    try {
      const cached = sessionStorage.getItem(`product_${slug}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantityModal, setQuantityModal] = useState(false);
  const [modalQty, setModalQty] = useState(1);

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (!slug || product) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setProduct(json.data);
            return;
          }
        }
        toast.error("Product not found.");
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast.error("Failed to load product. Please try again.");
      }
    };
    fetchProduct();
  }, [slug, product]);

  if (!product) {
    return (
      <>
        <Header />
        <div className="product-page">
          <div className="container" style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ color: "#888", fontSize: 16 }}>Loading product...</p>
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

  const displayPrice = product?.salePrice ?? product?.price ?? product?.sale_price ?? 0;
  const oldPrice = 0;
  const inStock = Number(product?.currentStock ?? product?.stockQuantity ?? product?.stock ?? 1) > 0;
  const discount = 0;

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error("This product is currently out of stock.");
      return;
    }
    dispatch(
      addToCart({
        productId: product._id || product.id,
        quantity,
        price: displayPrice,
        total: displayPrice * quantity,
        product: {
          id: product._id || product.id,
          name: product.name,
          slug: product.slug,
          price: displayPrice,
          images: images,
          description: product.description || "",
        },
        id: product._id || product.id,
        name: product.name,
        slug: product.slug,
        image: images[0],
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    const productId = product._id || product.id;
    const exists = cartItems.find((item) => item.productId === productId || item.id === productId);
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
        id: productId,
        name: product.name,
        slug: product.slug,
        image: images[0],
      })
    );
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

  const categoryName =
    product.category?.name || product.categoryName || "";

  return (
    <>
      <Header />
      <div className="product-page">
        <div className="container">
          <div className="breadcrumb">
            <span className="breadcrumb-link" onClick={() => router.push("/")}>Home</span>
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
                <img
                  src={images[activeThumb]?.startsWith("http") ? images[activeThumb] : `/images/${images[activeThumb]}`}
                  alt={product.name}
                  className="main-image"
                />
              </div>
              {images.length > 1 && (
                <div className="thumb-row">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={`thumb-btn ${activeThumb === i ? "active" : ""}`}
                    >
                      <img
                        src={src.startsWith("http") ? src : `/images/${src}`}
                        alt={`Thumb ${i + 1}`}
                        className="thumb-img"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="info-col">
              <h1 className="product-title">{product.name}</h1>

              <div className="meta-row">
                <span className={`in-stock`} style={{ color: inStock ? "#2d9c5a" : "#e53935" }}>
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
                <button className="buy-btn" onClick={handleBuyNow} disabled={!inStock}>
                  Buy Now
                </button>
              </div>

              <div className="social-row">
                <button className="whatsapp-btn" onClick={handleWhatsApp}>
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

          <div className="tabs-section">
            <div className="tabs-header">
              {["description", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                >
                  {tab === "description" ? "Description" : "Reviews"}
                </button>
              ))}
            </div>

            {activeTab === "description" && (
              <div className="tab-content">
                <h3 className="tab-heading">Product Details</h3>
                <p className="tab-text">
                  {product.description || "No description available."}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="tab-content">
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p className="tab-text" style={{ fontSize: 15, color: "#666" }}>
                    No reviews yet. Be the first to review this product!
                  </p>
                  <p className="tab-text" style={{ fontSize: 13, color: "#999", marginTop: 6 }}>
                    কোনো রিভিউ এখনো যোগ করা হয়নি।
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {quantityModal && (
        <div className="modal-overlay" onClick={() => setQuantityModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setQuantityModal(false)}>✕</button>
            <h3 className="modal-title">{product.name}</h3>
            <p className="modal-subtitle">Adjust quantity</p>
            <div className="modal-qty">
              <button className="qty-btn" onClick={() => setModalQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="qty-value">{modalQty}</span>
              <button className="qty-btn" onClick={() => setModalQty((q) => q + 1)}>+</button>
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
