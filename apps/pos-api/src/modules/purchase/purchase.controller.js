import Purchase from "./purchase.model.js";

import Product from "../product/product.model.js";

import PurchaseBatch from "../product/purchaseBatch.model.js";

import Supplier from "../supplier/supplier.model.js";

import createStockMovement from "../../helpers/createStockMovement.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

const generateInvoice = () => {
  return (
    "PUR-" +
    Date.now()
  );
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

    let totalAmount = 0;

    for (const item of items) {
      item.subtotal =
        item.quantity * item.purchasePrice;

      totalAmount += item.subtotal;
    }

    const totalAdditionalCost = additionalCosts.reduce(
      (sum, cost) => sum + (cost.amount || 0),
      0
    );

    totalAmount += totalAdditionalCost;

    for (const item of items) {
      // create purchase batch
      await PurchaseBatch.create({
        product: item.product,
        variantId: item.variantId,
        quantity: item.quantity,
        remainingQuantity: item.quantity,
        purchasePrice: item.purchasePrice,
      });

      const product = await Product.findById(
        item.product
      );

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
          // If variant not found (shouldn't happen with valid UI), fallback
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
        newStock: newStock,
        referenceId: null,
        createdBy: req.user._id,
      });
    }

    const dueAmount =
      totalAmount - paidAmount;

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

    const purchase = await Purchase.create({
      invoiceNo: generateInvoice(),
      supplier,
      items,
      additionalCosts,
      totalAmount,
      paidAmount,
      dueAmount,
      note,
    });

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
      .sort({
        createdAt: -1,
      });

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
