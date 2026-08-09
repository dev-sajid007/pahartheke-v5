import Product from "./product.model.js";

import mongoose from "mongoose";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

const generateSKU = () => {
  return (
    "SKU-" +
    Math.random().toString(36).substring(2, 8)
  ).toUpperCase();
};

export const createProduct = asyncHandler(async (req, res) => {
    let { hasVariants, variants, tags, ...rest } = req.body;
    
    // Parse variants if they come as a string (typical in multipart/form-data)
    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        variants = [];
      }
    }

    // Parse tags if they come as a string
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        tags = [];
      }
    }

    if (typeof hasVariants === 'string') {
      hasVariants = hasVariants === 'true';
    }

    let productData = {
      ...rest,
      hasVariants,
      tags: Array.isArray(tags) ? tags : [],
      sku: rest.sku || generateSKU(),
    };

    if (req.file) {
      productData.image = req.file.path;
    }

    if (hasVariants && variants && variants.length > 0) {
      productData.variants = variants.map(v => ({
        ...v,
        variantId: v.variantId || Math.random().toString(36).substring(2, 10).toUpperCase(),
        sku: v.sku || generateSKU(),
      }));
      
      // Calculate total stock from variants
      productData.currentStock = productData.variants.reduce((sum, v) => sum + (v.currentStock || 0), 0);
    }

    const product = await Product.create(productData);

    return apiResponse({
      res,
      statusCode: 201,
      message: "Product created successfully",
      data: product,
    });
  }
);

export const getProducts = asyncHandler(
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * (limit > 0 ? limit : 0);

    const filter = {};
    if (req.query.status !== undefined) {
      filter.status = req.query.status === "true";
    }

    const query = Product.find(filter).populate("category").sort({ createdAt: -1 });

    if (limit > 0) {
      query.skip(skip).limit(limit);
    }

    const [products, total] = await Promise.all([
      query,
      Product.countDocuments(filter)
    ]);

    return apiResponse({
      res,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        },
      },
    });
  }
);

import ApiError from "../../core/ApiError.js";

export const updateProduct = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    let { hasVariants, variants, tags, ...rest } = req.body;

    // Parse variants if they come as a string
    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        variants = [];
      }
    }

    // Parse tags if they come as a string
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch (e) {
        tags = [];
      }
    }

    if (typeof hasVariants === 'string') {
      hasVariants = hasVariants === 'true';
    }

    let updateData = { ...rest, hasVariants, tags: Array.isArray(tags) ? tags : [] };

    if (req.file) {
      updateData.image = req.file.path;
    }

    if (hasVariants && variants) {
      updateData.variants = variants.map(v => ({
        ...v,
        variantId: v.variantId || Math.random().toString(36).substring(2, 10).toUpperCase(),
        sku: v.sku || generateSKU(),
      }));
      // Recalculate total stock from variants
      updateData.currentStock = updateData.variants.reduce((sum, v) => sum + (v.currentStock || 0), 0);
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return apiResponse({
      res,
      statusCode: 200,
      message: "Product updated",
      data: product,
    });
  }
);

export const deleteProduct = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    
    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    await product.deleteOne();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Product deleted",
    });
  }
);
