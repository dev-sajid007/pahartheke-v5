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
  return (
    "SALE-" +
    Date.now()
  );
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

    let subtotal = 0;

    let totalCost = 0;

    let totalProfit = 0;

    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(
        item.product
      );

      if (!product) {
        throw new ApiError(
          404,
          "Product not found"
        );
      }

      // Stock check
      if (product.hasVariants && item.variantId) {
        const variant = product.variants.find(v => v.variantId === item.variantId);
        if (!variant || variant.currentStock < item.quantity) {
          throw new ApiError(400, `Insufficient stock for ${product.name} (${item.variantName || 'Selected Variant'})`);
        }
      } else if (product.currentStock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name}`
        );
      }

      let remainingQty = item.quantity;
      let itemCost = 0;

      // FIFO batches - filter by variantId if it exists
      const batchQuery = {
        product: product._id,
        remainingQuantity: { $gt: 0 },
      };
      if (item.variantId) {
        batchQuery.variantId = item.variantId;
      }

      const batches = await PurchaseBatch.find(batchQuery).sort({
        createdAt: 1,
      });

      for (const batch of batches) {
        if (remainingQty <= 0) break;

        const deductQty = Math.min(
          remainingQty,
          batch.remainingQuantity
        );

        itemCost +=
          deductQty * batch.purchasePrice;

        batch.remainingQuantity = parseFloat((batch.remainingQuantity - deductQty).toFixed(6));

        await batch.save();

        remainingQty = parseFloat((remainingQty - deductQty).toFixed(6));
      }

      if (remainingQty > 0.0001) {
        throw new ApiError(
          400,
          `Batch stock mismatch for ${product.name}`
        );
      }

      const itemSubtotal =
        item.quantity * item.salePrice;

      const itemProfit =
        itemSubtotal - itemCost;

      subtotal += itemSubtotal;
      totalCost += itemCost;
      totalProfit += itemProfit;

      let previousStock;
      let newStock;

      if (product.hasVariants && item.variantId) {
        const vIndex = product.variants.findIndex(v => v.variantId === item.variantId);
        previousStock = product.variants[vIndex].currentStock;
        product.variants[vIndex].currentStock = parseFloat((product.variants[vIndex].currentStock - item.quantity).toFixed(6));
        // Also update total product stock
        product.currentStock = parseFloat((product.currentStock - item.quantity).toFixed(6));
        newStock = product.variants[vIndex].currentStock;
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
        referenceId: null,
        createdBy: req.user?._id || null,
      });

      saleItems.push({
        product: item.product,
        variantId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        salePrice: item.salePrice,
        itemDiscountType: item.itemDiscountType || "None",
        itemDiscount: item.itemDiscount || 0,
        subtotal: itemSubtotal,
        cost: itemCost,
        profit: itemProfit,
      });
    }

    const grandTotal = subtotal - discount - badgeDiscount + Number(shippingCost);

    const dueAmount =
      grandTotal - paidAmount;

    if (customer) {
      const customerDoc = await Customer.findById(customer);
      if (customerDoc) {
        customerDoc.totalSpent += grandTotal;
        customerDoc.totalOrders += 1;
        customerDoc.previousDue += dueAmount;
        customerDoc.loyaltyPoints += Math.floor(grandTotal / 100);

        // Find applicable badge
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
    }

    const sale = await Sale.create({
      invoiceNo: generateInvoice(),
      customer,
      items: saleItems,
      subtotal,
      shippingCost,
      discount,
      badgeName,
      badgeDiscount,
      grandTotal,
      paidAmount,
      dueAmount,
      totalCost,
      totalProfit,
      note,
      soldBy: req.user?._id || null,
      source: "pos",
      order_date: order_date ? new Date(order_date) : new Date(),
    });

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
      const matchingCustomers = await Customer.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const customerIds = matchingCustomers.map((c) => c._id);

      query.$or = [
        { invoiceNo: { $regex: search, $options: "i" } },
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
