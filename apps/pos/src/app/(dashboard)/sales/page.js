"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import ProductGrid from "@/components/pos/ProductGrid";
import CartPanel from "@/components/pos/CartPanel";
import VariantSelector from "@/components/pos/VariantSelector";
import CustomerModal from "@/components/customers/CustomerModal";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const PRODUCTS_PER_PAGE = 30;

export default function POSPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Modals state
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const [newCustomer, setNewCustomer] = useState(null);
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
      const [catRes, custRes] = await Promise.all([
        api.get("/categories"),
        api.get("/customers?all=true"),
      ]);
      setCategories(catRes.data.data || []);
      setCustomers(custRes.data.data || []);
    } catch (error) {
      console.error("Error fetching POS data:", error);
      toast.error("Failed to load POS data. Please check your connection.");
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
        salePrice: variant ? variant.salePrice : product.salePrice,
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

  const removeFromCart = (productId, variantId = null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item._id === productId && item.variantId === variantId)
      )
    );
  };

  const handleSaveCustomer = async (formData) => {
    try {
      const res = await api.post("/customers", formData);
      const addedCustomer = res.data.data;
      setCustomers((prev) => [addedCustomer, ...prev]);
      setNewCustomer(addedCustomer);
      setIsCustomerModalOpen(false);
      toast.success("Customer added successfully!");
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error(error.response?.data?.message || "Failed to add customer");
    }
  };

  const processSale = async (saleData) => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      const payload = {
        customer: saleData.customer || null,
        items: cart.map(item => {
          const itemKey = `${item._id}-${item.variantId || ''}`;
          const disc = saleData.itemDiscounts?.[itemKey];
          return {
            product: item._id,
            variantId: item.variantId,
            variantName: item.variantName,
            quantity: item.cartQuantity,
            salePrice: item.salePrice,
            itemDiscountType: disc?.type || "None",
            itemDiscount: disc?.value || 0,
          };
        }),
        discount: saleData.discount || 0,
        shippingCost: saleData.shippingCost || 0,
        badgeName: saleData.badgeName,
        badgeDiscount: saleData.badgeDiscount,
        paidAmount: saleData.paidAmount,
        note: saleData.notes || ""
      };

      await api.post("/sales", payload);
      toast.success("Sale completed successfully!");
      setCart([]);
      fetchProducts(); // Refresh stock with pagination reset
    } catch (error) {
      console.error("Error processing sale:", error);
      toast.error(error.response?.data?.message || "Failed to complete sale");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-sidebar-foreground">Loading POS System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#F8FAFC]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <RefreshCw className={`h-5 w-5 text-primary-foreground ${isProcessing ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Point of Sale</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground opacity-70">
              Terminal 01 • {dateString}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
         <button 
              onClick={() => fetchProducts()}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground transition-all hover:bg-sidebar-accent"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync Data
            </button>
        </div>
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
          />
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="flex-[60] flex flex-col min-w-0">
          <CartPanel 
            cart={cart}
            customers={customers}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            processSale={processSale}
            onAddCustomer={() => setIsCustomerModalOpen(true)}
            newCustomer={newCustomer}
          />
        </div>
      </main>


      {/* Modals */}
      <VariantSelector 
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        product={selectedProductForVariant}
        onSelect={(variant) => addToCartState(selectedProductForVariant, variant)}
      />

      <CustomerModal 
        key="new"
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
      />
    </div>
  );
}