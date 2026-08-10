"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, RefreshCw, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import ProductGrid from "@/components/pos/ProductGrid";
import PurchaseCartPanel from "@/components/pos/PurchaseCartPanel";
import VariantSelector from "@/components/pos/VariantSelector";
import SupplierModal from "@/components/suppliers/SupplierModal";
import { useToast } from "@/components/ui/toast";

const PRODUCTS_PER_PAGE = 30;

export default function NewPurchasePage() {
  const router = useRouter();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [costTypes, setCostTypes] = useState([]);
  const [cart, setCart] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] = useState(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const [newSupplier, setNewSupplier] = useState(null);
  const [dateString] = useState(() => new Date().toLocaleDateString());

  const fetchProducts = useCallback(async (page = 1, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
      const res = await api.get(`/products?page=${page}&limit=${PRODUCTS_PER_PAGE}`);
      const { products: newProducts, pagination } = res.data.data;
      if (append) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }
      setCurrentPage(pagination.page);
      setTotalPages(pagination.totalPages);
      setHasMore(pagination.page < pagination.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      fetchProducts(currentPage + 1, true);
    }
  }, [currentPage, isLoadingMore, hasMore, fetchProducts]);

  const fetchData = useCallback(async () => {
    try {
      const [catRes, supRes, costRes] = await Promise.all([
        api.get("/categories"),
        api.get("/suppliers"),
        api.get("/purchase-costs"),
      ]);
      setCategories(catRes.data.data || []);
      setSuppliers((supRes.data.data || []).filter(s => s.status === true));
      setCostTypes((costRes.data.data || []).filter(c => c.status === true));
    } catch (error) {
      console.error("Error fetching purchase data:", error);
      toast.error("Failed to load purchase data.");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchData();
  }, [fetchProducts, fetchData]);

  const handleAddToCart = (product) => {
    if (product.hasVariants && product.variants?.length > 0) {
      setSelectedProductForVariant(product);
      setIsVariantModalOpen(true);
    } else {
      addToCartState(product);
    }
  };

  const addToCartState = (product, variant = null) => {
    setCart((prevCart) => {
      const itemKey = `${product._id}-${variant?.variantId || ""}`;
      const existingItemIndex = prevCart.findIndex(
        (item) => `${item._id}-${item.variantId || ""}` === itemKey
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].cartQuantity += 1;
        return newCart;
      }

      const newItem = {
        ...product,
        variantId: variant?.variantId || null,
        variantName: variant?.name || null,
        purchasePrice: variant ? variant.purchasePrice : product.purchasePrice,
        cartQuantity: 1,
      };
      return [...prevCart, newItem];
    });
    setIsVariantModalOpen(false);
  };

  const updateQuantity = (productId, qty, variantId = null) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId && item.variantId === variantId
          ? { ...item, cartQuantity: qty }
          : item
      )
    );
  };

  const updateUnitCost = (productId, cost, variantId = null) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId && item.variantId === variantId
          ? { ...item, purchasePrice: cost }
          : item
      )
    );
  };

  const removeFromCart = (productId, variantId = null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item._id === productId && item.variantId === variantId)
      )
    );
  };

  const handleSaveSupplier = async (formData) => {
    try {
      const res = await api.post("/suppliers", formData);
      const addedSupplier = res.data.data;
      setSuppliers((prev) => [addedSupplier, ...prev]);
      setNewSupplier(addedSupplier);
      setIsSupplierModalOpen(false);
      toast.success("Supplier added successfully!");
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error(error.response?.data?.message || "Failed to add supplier");
    }
  };

  const processPurchase = async ({ supplier, paidAmount, notes, additionalCosts }) => {
    if (cart.length === 0) return;

    const validItems = cart.filter(i => i.cartQuantity > 0);
    if (validItems.length === 0) {
      toast.error("কমপক্ষে একটি প্রোডাক্ট সিলেক্ট করুন");
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        supplier: supplier || null,
        items: validItems.map(i => ({
          product: i._id,
          variantId: i.variantId || undefined,
          quantity: i.cartQuantity,
          purchasePrice: i.purchasePrice,
        })),
        paidAmount: paidAmount || 0,
        note: notes || "",
        additionalCosts: additionalCosts.filter(c => c.name),
      };

      await api.post("/purchases", payload);
      toast.success("Purchase created successfully!");
      router.push("/purchases");
    } catch (error) {
      console.error("Failed to create purchase", error);
      toast.error(error.response?.data?.message || "Failed to create purchase");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-sidebar-foreground">Loading Purchase System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F8FAFC]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/purchases" className="rounded-full p-1.5 hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Truck className={`h-5 w-5 text-primary-foreground ${isProcessing ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Record New Purchase</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground opacity-70">
              Purchase Terminal • {dateString}
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchProducts()}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground transition-all hover:bg-sidebar-accent"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Sync Data
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Left Side: Product Selection */}
        <div className="flex-[40] flex flex-col min-w-0">
          <ProductGrid
            products={products}
            categories={categories}
            onAddToCart={handleAddToCart}
            loadMore={loadMoreProducts}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            priceField="purchasePrice"
          />
        </div>

        {/* Right Side: Purchase Cart */}
        <div className="flex-[60] flex flex-col min-w-0">
          <PurchaseCartPanel
            cart={cart}
            suppliers={suppliers}
            costTypes={costTypes}
            updateQuantity={updateQuantity}
            updateUnitCost={updateUnitCost}
            removeFromCart={removeFromCart}
            onSubmit={processPurchase}
            onAddSupplier={() => setIsSupplierModalOpen(true)}
            newSupplier={newSupplier}
          />
        </div>
      </main>

      {/* Modals */}
      <VariantSelector
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        product={selectedProductForVariant}
        onSelect={(variant) => addToCartState(selectedProductForVariant, variant)}
        priceField="purchasePrice"
      />

      <SupplierModal
        key="new"
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSave={handleSaveSupplier}
      />
    </div>
  );
}
