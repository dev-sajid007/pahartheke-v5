"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductModal({ isOpen, onClose, product = null, categories = [], onSave }) {
  const [formData, setFormData] = useState(() => product ? {
    ...product,
    slug: product.slug || "",
    description: product.description || "",
    tags: Array.isArray(product.tags) ? product.tags : [],
    category: product.category?._id || product.category || "",
    hasVariants: product.hasVariants || false,
    variants: product.variants || [],
  } : {
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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
          stockQuantity: 0,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      purchasePrice: Number(formData.purchasePrice),
      salePrice: Number(formData.salePrice),
      minimumStockAlert: Number(formData.minimumStockAlert),
      tags: formData.tags.filter(Boolean),
      variants: formData.hasVariants ? formData.variants.map(v => ({
        ...v,
        purchasePrice: Number(v.purchasePrice),
        salePrice: Number(v.salePrice),
        stockQuantity: Number(v.stockQuantity),
      })) : []
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-card p-6 shadow-xl transition-all sm:p-8 my-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-bold text-foreground">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                placeholder="e.g. Wireless Mouse M330"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
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
                placeholder="pcs, kg, etc."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Stock Alert</label>
              <input
                type="number"
                name="minimumStockAlert"
                value={formData.minimumStockAlert}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="organic-honey-500g"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags.join(", ")}
                onChange={handleTagsChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Organic, Hilltract"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y"
              placeholder="Product description for storefront..."
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
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
                  This product has multiple variants (Size, Color, etc.)
                </label>
              </div>
            </div>

            {!formData.hasVariants ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 animate-in fade-in slide-in-from-top-1">
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
              <div className="space-y-4 rounded-2xl border border-border bg-sidebar-accent/30 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Variants List</h3>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + Add Variant
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="sm:col-span-3">
                        <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">Variant Name</label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none"
                          placeholder="XL / Red"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">SKU</label>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">Purchase</label>
                        <input
                          type="number"
                          value={v.purchasePrice}
                          onChange={(e) => handleVariantChange(idx, "purchasePrice", e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">Sale</label>
                        <input
                          type="number"
                          value={v.salePrice}
                          onChange={(e) => handleVariantChange(idx, "salePrice", e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-[10px] font-bold text-sidebar-foreground uppercase">Stock</label>
                        <input
                          type="number"
                          value={v.stockQuantity}
                          onChange={(e) => handleVariantChange(idx, "stockQuantity", e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="mb-1 rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {formData.variants.length === 0 && (
                    <p className="text-center py-4 text-xs text-sidebar-foreground italic">
                      No variants added yet. Click "+ Add Variant" to start.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

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
              Active Status
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20"
            >
              {product ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
