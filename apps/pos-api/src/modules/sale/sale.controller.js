import Sale from "./sale.model.js";

import Product from "../product/product.model.js";

import PurchaseBatch from "../product/purchaseBatch.model.js";

import Customer from "../customer/customer.model.js";

import Badge from "../customer/badge.model.js";

import createStockMovement from "../../helpers/createStockMovement.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

import ApiError from "../../core/ApiError.js";

const generateInvoice = () => {
  return "SALE-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const createSale = asyncHandler(
  async (req, res) => {
    const {
      customer,
      items,
      discount = 0,
      shippingCost = 0,
      badgeName,
      badgeDiscount = 0,
      paidAmount = 0,
      note,
      order_date,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "At least one item is required");
    }

    let subtotal = 0;
    let totalCost = 0;
    let totalProfit = 0;
    const saleItems = [];

    for (const item of items) {
      if (!item.product) {
        throw new ApiError(400, "Each item must have a product ID");
      }
      if (!item.salePrice || item.salePrice <= 0) {
        throw new ApiError(400, "Each item must have a valid sale price");
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new ApiError(400, "Each item must have a valid quantity");
      }

      const product = await Product.findById(item.product);
      if (!product) {
        throw new ApiError(404, `Product not found: ${item.product}`);
      }

      if (product.hasVariants && item.variantId) {
        const variant = product.variants.find(v => v.variantId === item.variantId);
        if (!variant || variant.currentStock < item.quantity) {
          throw new ApiError(400, `Insufficient stock for ${product.name} (${item.variantName || 'Selected Variant'})`);
        }
      } else if (product.currentStock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }

      let remainingQty = item.quantity;
      let itemCost = 0;

      const batchQuery = {
        product: product._id,
        remainingQuantity: { $gt: 0 },
      };
      if (item.variantId) {
        batchQuery.variantId = item.variantId;
      }

      const batches = await PurchaseBatch.find(batchQuery).sort({ createdAt: 1 });

      for (const batch of batches) {
        if (remainingQty <= 0) break;

        const deductQty = Math.min(remainingQty, batch.remainingQuantity);
        itemCost += deductQty * batch.purchasePrice;

        await PurchaseBatch.findOneAndUpdate(
          { _id: batch._id, remainingQuantity: { $gte: deductQty } },
          { $inc: { remainingQuantity: -deductQty } }
        );

        remainingQty = parseFloat((remainingQty - deductQty).toFixed(6));
      }

      if (remainingQty > 0.0001) {
        throw new ApiError(400, `Batch stock mismatch for ${product.name}`);
      }

      const baseTotal = item.quantity * item.salePrice;
      let discAmount = 0;
      if (item.itemDiscountType === "Percentage") {
        discAmount = baseTotal * (item.itemDiscount || 0) / 100;
      } else if (item.itemDiscountType === "Fixed") {
        discAmount = item.itemDiscount || 0;
      }
      const lineTotal = baseTotal - discAmount;

      const itemProfit = lineTotal - itemCost;

      subtotal += lineTotal;
      totalCost += itemCost;
      totalProfit += itemProfit;

      saleItems.push({
        product: item.product,
        variantId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        salePrice: item.salePrice,
        itemDiscountType: item.itemDiscountType || "None",
        itemDiscount: discAmount,
        subtotal: lineTotal,
        cost: itemCost,
        profit: itemProfit,
      });
    }

    const safeDiscount = Number(discount) || 0;
    const safeBadgeDiscount = Number(badgeDiscount) || 0;
    const safeShippingCost = Number(shippingCost) || 0;
    const safePaidAmount = Number(paidAmount) || 0;

    const grandTotal = subtotal - safeDiscount - safeBadgeDiscount + safeShippingCost;
    const dueAmount = Math.max(0, grandTotal - safePaidAmount);

    const sale = await Sale.create({
      invoiceNo: generateInvoice(),
      customer,
      items: saleItems,
      subtotal,
      shippingCost: safeShippingCost,
      discount: safeDiscount,
      badgeName,
      badgeDiscount: safeBadgeDiscount,
      grandTotal,
      paidAmount: safePaidAmount,
      dueAmount,
      totalCost,
      totalProfit,
      note,
      soldBy: req.user?._id || null,
      source: "pos",
      order_date: order_date ? new Date(order_date) : new Date(),
    });

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      let previousStock;
      let newStock;

      if (product.hasVariants && item.variantId) {
        const vIndex = product.variants.findIndex(v => v.variantId === item.variantId);
        if (vIndex !== -1) {
          previousStock = product.variants[vIndex].currentStock;
          product.variants[vIndex].currentStock = parseFloat((product.variants[vIndex].currentStock - item.quantity).toFixed(6));
          product.currentStock = parseFloat((product.currentStock - item.quantity).toFixed(6));
          newStock = product.variants[vIndex].currentStock;
        } else {
          previousStock = product.currentStock;
          product.currentStock = parseFloat((product.currentStock - item.quantity).toFixed(6));
          newStock = product.currentStock;
        }
      } else {
        previousStock = product.currentStock;
        product.currentStock = parseFloat((product.currentStock - item.quantity).toFixed(6));
        newStock = product.currentStock;
      }

      await product.save();

      await createStockMovement({
        product: product._id,
        variantId: item.variantId,
        type: "sale",
        quantity: item.quantity,
        previousStock,
        newStock,
        referenceId: sale._id,
        createdBy: req.user?._id || null,
      });
    }

    if (customer) {
      try {
        const customerDoc = await Customer.findById(customer);
        if (customerDoc) {
          const previousSpent = customerDoc.totalSpent || 0;
          const previousOrders = customerDoc.totalOrders || 0;

          customerDoc.totalSpent = previousSpent + grandTotal;
          customerDoc.totalOrders = previousOrders + 1;
          customerDoc.previousDue = (customerDoc.previousDue || 0) + dueAmount;
          customerDoc.loyaltyPoints = (customerDoc.loyaltyPoints || 0) + Math.floor(grandTotal / 100);

          const allBadges = await Badge.find({ status: true });
          let applicableBadge = null;
          let highestDiscount = -1;

          for (const b of allBadges) {
            if (b.conditions && b.conditions.length > 0) {
              const matchesAll = b.conditions.every(cond => {
                const val = customerDoc[cond.field];
                switch (cond.operator) {
                  case 'gt': return val > cond.value;
                  case 'lt': return val < cond.value;
                  case 'gte': return val >= cond.value;
                  case 'lte': return val <= cond.value;
                  case 'eq': return val === cond.value;
                  default: return false;
                }
              });

              if (matchesAll && b.discount > highestDiscount) {
                applicableBadge = b;
                highestDiscount = b.discount;
              }
            }
          }

          if (applicableBadge) {
            customerDoc.badge = applicableBadge._id;
          }

          await customerDoc.save();
        }
      } catch (error) {
        console.error("Failed to update customer stats:", error);
      }
    }

    return apiResponse({
      res,
      statusCode: 201,
      message: "Sale completed successfully",
      data: sale,
    });
  }
);

export const getSales = asyncHandler(
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matchingCustomers = await Customer.find({
        $or: [
          { name: { $regex: escapedSearch, $options: "i" } },
          { phone: { $regex: escapedSearch, $options: "i" } },
        ],
      }).select("_id");

      const customerIds = matchingCustomers.map((c) => c._id);

      query.$or = [
        { invoiceNo: { $regex: escapedSearch, $options: "i" } },
        ...(customerIds.length > 0 ? [{ customer: { $in: customerIds } }] : []),
      ];
    }

    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      Sale.find(query)
        .populate("customer")
        .populate("items.product")
        .populate("soldBy", "name email")
        .sort({ order_date: -1 })
        .skip(skip)
        .limit(limit),
      Sale.countDocuments(query),
    ]);

    return apiResponse({
      res,
      data: {
        sales,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  }
);

export const getSale = asyncHandler(
  async (req, res) => {
    const sale = await Sale.findById(req.params.id)
      .populate("customer")
      .populate("items.product")
      .populate("soldBy", "name email");

    if (!sale) {
      throw new ApiError(404, "Sale not found");
    }

    return apiResponse({
      res,
      data: sale,
    });
  }
);
