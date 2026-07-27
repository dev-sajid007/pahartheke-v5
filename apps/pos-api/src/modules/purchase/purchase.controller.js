import Purchase from "./purchase.model.js";

import Product from "../product/product.model.js";

import PurchaseBatch from "../product/purchaseBatch.model.js";

import Supplier from "../supplier/supplier.model.js";

import createStockMovement from "../../helpers/createStockMovement.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

import ApiError from "../../core/ApiError.js";

const generateInvoice = () => {
  return "PUR-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const createPurchase = asyncHandler(
  async (req, res) => {
    const {
      supplier,
      items,
      paidAmount = 0,
      note,
      additionalCosts = [],
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "At least one item is required");
    }

    let totalAmount = 0;

    for (const item of items) {
      if (!item.product) {
        throw new ApiError(400, "Each item must have a product ID");
      }
      if (!item.purchasePrice || item.purchasePrice <= 0) {
        throw new ApiError(400, "Each item must have a valid purchase price");
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new ApiError(400, "Each item must have a valid quantity");
      }

      item.subtotal = item.quantity * item.purchasePrice;
      totalAmount += item.subtotal;
    }

    const totalAdditionalCost = additionalCosts.reduce(
      (sum, cost) => sum + (cost.amount || 0),
      0
    );

    totalAmount += totalAdditionalCost;

    const dueAmount = Math.max(0, totalAmount - (Number(paidAmount) || 0));

    const purchase = await Purchase.create({
      invoiceNo: generateInvoice(),
      supplier,
      items,
      additionalCosts,
      totalAmount,
      paidAmount: Number(paidAmount) || 0,
      dueAmount,
      note,
    });

    for (const item of items) {
      await PurchaseBatch.create({
        product: item.product,
        variantId: item.variantId,
        quantity: item.quantity,
        remainingQuantity: item.quantity,
        purchasePrice: item.purchasePrice,
      });

      const product = await Product.findById(item.product);
      if (!product) continue;

      let oldStock;
      let newStock;

      if (product.hasVariants && item.variantId) {
        const vIndex = product.variants.findIndex(v => v.variantId === item.variantId);
        if (vIndex !== -1) {
          oldStock = product.variants[vIndex].currentStock;
          product.variants[vIndex].currentStock += item.quantity;
          product.variants[vIndex].purchasePrice = item.purchasePrice;
          product.currentStock += item.quantity;
          newStock = product.variants[vIndex].currentStock;
        } else {
          oldStock = product.currentStock;
          product.currentStock += item.quantity;
          newStock = product.currentStock;
        }
      } else {
        oldStock = product.currentStock;
        product.currentStock += item.quantity;
        product.purchasePrice = item.purchasePrice;
        newStock = product.currentStock;
      }

      await product.save();

      await createStockMovement({
        product: item.product,
        variantId: item.variantId,
        type: "purchase",
        quantity: item.quantity,
        previousStock: oldStock,
        newStock,
        referenceId: purchase._id,
        createdBy: req.user._id,
      });
    }

    if (supplier) {
      await Supplier.findByIdAndUpdate(
        supplier,
        {
          $inc: {
            previousDue: dueAmount,
            totalPurchaseAmount: totalAmount,
          },
        }
      );
    }

    return apiResponse({
      res,
      statusCode: 201,
      message: "Purchase created successfully",
      data: purchase,
    });
  }
);

export const getPurchases = asyncHandler(
  async (req, res) => {
    const purchases = await Purchase.find()
      .populate("supplier")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return apiResponse({
      res,
      data: purchases,
    });
  }
);

export const getPurchase = asyncHandler(
  async (req, res) => {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier")
      .populate("items.product");

    if (!purchase) {
      return apiResponse({
        res,
        statusCode: 404,
        message: "Purchase not found",
      });
    }

    return apiResponse({
      res,
      data: purchase,
    });
  }
);
