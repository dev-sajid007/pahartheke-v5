"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Save, X, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/toast";
import { buildCategoryTree, flattenCategoryTree } from "@/lib/categoryTree";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const toast = useToast();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    slug: "",
    description: "",
    tags: [],
    category: "",
    productType: "piece",
    unit: "pcs",
    purchasePrice: 0,
    salePrice: 0,
    minimumStockAlert: 5,
    status: true,
    hasVariants: false,
    variants: [],
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productRes, catRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get("/categories")
      ]);

      if (catRes.data.data) setCategories(catRes.data.data);
      
      const product = productRes.data.data;
      if (product) {
        setFormData({
          ...product,
          slug: product.slug || "",
          description: product.description || "",
          tags: Array.isArray(product.tags) ? product.tags : [],
          category: product.category?._id || product.category || "",
          hasVariants: product.hasVariants || false,
          variants: product.variants || [],
        });
        if (product.image) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:7104';
          setImagePreview(product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product data", error);
      toast.error("Error loading product");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const categoryOptions = useMemo(
    () => flattenCategoryTree(buildCategoryTree(categories)),
    [categories]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagsChange = (e) => {
    const raw = e.target.value;
    const tagsArray = raw.split(",").map((t) => t.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "",
          sku: `V-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          purchasePrice: prev.purchasePrice,
          salePrice: prev.salePrice,
          currentStock: 0,
        }
      ]
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const data = new FormData();
      
      // We don't want to send these fields as they are part of the base object or handled separately
      const skipFields = ['_id', 'createdAt', 'updatedAt', '__v', 'image'];
      
      Object.keys(formData).forEach(key => {
        if (skipFields.includes(key)) return;

        if (key === 'variants') {
          data.append('variants', JSON.stringify(formData.variants.map(v => ({
            ...v,
            purchasePrice: Number(v.purchasePrice),
            salePrice: Number(v.salePrice),
            currentStock: Number(v.currentStock),
          }))));
        } else if (key === 'tags') {
          if (formData.tags.length > 0) {
            data.append('tags', JSON.stringify(formData.tags));
          }
        } else {
          data.append(key, formData[key]);
        }
      });

      if (imageFile) {
        data.append('image', imageFile);
      }
      
      await api.put(`/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success("Product updated successfully!");
      router.push("/products");
    } catch (error) {
      console.error("Failed to update product", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link href="/products" className="rounded-full p-1.5 hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Product Image</h2>
          <div className="flex items-center gap-6">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-sidebar-accent/20 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <Plus className="h-8 w-8 text-sidebar-foreground opacity-30" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs text-sidebar-foreground">
                Upload a product image. Recommended size: 800x800px. Max size: 2MB.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-sidebar-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-blue-600 transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select Category</option>
                {categoryOptions.map(cat => (
                  <option key={cat._id} value={cat._id}>{"— ".repeat(cat.depth)}{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Product Type</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="piece">Piece</option>
                <option value="weight">Weight</option>
                <option value="packet">Packet</option>
                <option value="bundle">Bundle</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Stock Alert Level</label>
              <input
                type="number"
                name="minimumStockAlert"
                value={formData.minimumStockAlert}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* SEO & Details */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-foreground">SEO & Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Slug (URL Path)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. organic-honey-500g"
              />
              <p className="mt-1 text-[11px] text-sidebar-foreground/60">URL-friendly name. Leave empty to use product ID.</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags.join(", ")}
                onChange={handleTagsChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Organic, Hilltract, Natural"
              />
              <p className="mt-1 text-[11px] text-sidebar-foreground/60">Comma-separated tags for product filtering.</p>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
              placeholder="Product description for the storefront detail page..."
            />
          </div>
        </div>

        {/* Pricing & Variants */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Pricing & Stock</h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasVariants"
                name="hasVariants"
                checked={formData.hasVariants}
                onChange={handleChange}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="hasVariants" className="text-sm font-bold text-foreground">
                Enable Multi-Variants
              </label>
            </div>
          </div>

          {!formData.hasVariants ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 animate-in fade-in duration-300">
              <div>
                <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Purchase Price (BDT) *</label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  required={!formData.hasVariants}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Sale Price (BDT) *</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  required={!formData.hasVariants}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <p className="text-xs font-bold text-sidebar-foreground uppercase tracking-widest">Variant Details</p>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" /> Add Variant
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.variants.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-1 gap-4 sm:grid-cols-12 items-end rounded-xl border border-border p-4 bg-sidebar-accent/20">
                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">Variant Name</label>
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">SKU</label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">Purchase</label>
                      <input
                        type="number"
                        value={v.purchasePrice}
                        onChange={(e) => handleVariantChange(idx, "purchasePrice", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">Sale</label>
                      <input
                        type="number"
                        value={v.salePrice}
                        onChange={(e) => handleVariantChange(idx, "salePrice", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">Stock</label>
                      <input
                        type="number"
                        value={v.currentStock}
                        onChange={(e) => handleVariantChange(idx, "currentStock", e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-center pb-1">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-100 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status & Save */}
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="status" className="text-sm font-medium text-foreground">
              Product is active and visible in POS
            </label>
          </div>
          <div className="flex gap-3">
            <Link href="/products" className="rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
