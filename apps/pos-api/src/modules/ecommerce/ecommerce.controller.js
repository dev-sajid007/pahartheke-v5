import mongoose from "mongoose";
import Category from "../category/category.model.js";
import { getDescendantIds } from "../category/category.helper.js";
import Product from "../product/product.model.js";
import Sale from "../sale/sale.model.js";
import Customer from "../customer/customer.model.js";
import PurchaseBatch from "../product/purchaseBatch.model.js";
import createStockMovement from "../../helpers/createStockMovement.js";
import asyncHandler from "../../utils/asyncHandler.js";
import apiResponse from "../../utils/apiResponse.js";
import ApiError from "../../core/ApiError.js";

const generateInvoice = () => {
  return "WEB-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: true })
    .populate("parent", "name slug")
    .sort({ createdAt: -1 });

  return apiResponse({
    res,
    data: categories,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { status: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) {
      const descendantIds = await getDescendantIds(cat._id);
      filter.category = { $in: [cat._id, ...descendantIds] };
    } else {
      return apiResponse({ res, data: [] });
    }
  }

  const products = await Product.find(filter)
    .populate("category", "name slug image")
    .sort({ createdAt: -1 });

  return apiResponse({
    res,
    data: products,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let product;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id).populate(
      "category",
      "name slug image"
    );
  }

  if (!product) {
    product = await Product.findOne({ slug: id }).populate(
      "category",
      "name slug image"
    );
  }

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return apiResponse({
    res,
    data: product,
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const {
    externalOrderId,
    items,
    customerInfo,
    note,
    payment_type,
    payment_status,
    discount,
    shippingCost,
  } = req.body;

  if (!externalOrderId) {
    throw new ApiError(400, "Checkout ID is required");
  }

  const existingSale = await Sale.findOne({ externalOrderId });
  if (existingSale) {
    return apiResponse({
      res,
      message: "Order already placed",
      data: existingSale,
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "No items in order");
  }

  if (!customerInfo || !customerInfo.phone) {
    throw new ApiError(400, "Customer phone is required");
  }

  let subtotal = 0;
  let totalCost = 0;
  let totalProfit = 0;
  const saleItems = [];

  for (const item of items) {
    if (!item.product || !item.quantity || item.quantity <= 0) {
      throw new ApiError(400, "Each item must have a product ID and valid quantity");
    }

    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product not found: ${item.product}`);
    }

    if (!product.status) {
      throw new ApiError(400, `Product is unavailable: ${product.name}`);
    }

    if (product.hasVariants) {
      const variant = item.variantId
        ? product.variants.find((v) => v.variantId === item.variantId)
        : null;
      if (variant && variant.currentStock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name} (${item.variantName || "Selected Variant"})`
        );
      }
      if (!variant && product.currentStock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name}`
        );
      }
    } else if (product.currentStock < item.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for ${product.name}`
      );
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

    const totalBatchQty = batches.reduce(
      (sum, b) => sum + b.remainingQuantity,
      0
    );

    if (totalBatchQty < item.quantity) {
      const shortfall = item.quantity - totalBatchQty;
      const fallbackBatch = await PurchaseBatch.create({
        product: product._id,
        variantId: item.variantId,
        quantity: shortfall,
        remainingQuantity: shortfall,
        purchasePrice: product.purchasePrice || 0,
      });
      batches.push(fallbackBatch);
    }

    for (const batch of batches) {
      if (remainingQty <= 0) break;

      const deductQty = Math.min(remainingQty, batch.remainingQuantity);
      itemCost += deductQty * batch.purchasePrice;
      batch.remainingQuantity = parseFloat(
        (batch.remainingQuantity - deductQty).toFixed(6)
      );
      await batch.save();
      remainingQty = parseFloat((remainingQty - deductQty).toFixed(6));
    }

    const salePrice = item.salePrice || product.salePrice;
    const itemSubtotal = item.quantity * salePrice;
    const itemProfit = itemSubtotal - itemCost;

    subtotal += itemSubtotal;
    totalCost += itemCost;
    totalProfit += itemProfit;

    saleItems.push({
      product: item.product,
      variantId: item.variantId,
      variantName: item.variantName,
      quantity: item.quantity,
      salePrice,
      subtotal: itemSubtotal,
      cost: itemCost,
      profit: itemProfit,
    });
  }

  const orderDiscount = Math.max(Number(discount) || 0, 0);
  const orderShipping = Math.max(Number(shippingCost) || 0, 0);
  const grandTotal = subtotal + orderShipping - orderDiscount;
  const paidAmount = payment_status === "paid" ? grandTotal : 0;

  const sale = await Sale.create({
    externalOrderId,
    invoiceNo: generateInvoice(),
    items: saleItems,
    subtotal,
    discount: orderDiscount,
    shippingCost: orderShipping,
    grandTotal,
    paidAmount,
    dueAmount: grandTotal - paidAmount,
    totalCost,
    totalProfit,
    note: note || "Order from website",
    source: "website",
    order_date: new Date(),
    customerName: customerInfo?.name || "",
    customerPhone: customerInfo?.phone || "",
    customerEmail: customerInfo?.email || "",
    customerAddress: customerInfo?.address || "",
    customerCity: customerInfo?.city || "",
    paymentType: payment_type || "cash_on_delivery",
  });

  let customerRecord = null;
  try {
    if (customerInfo?.phone) {
      customerRecord = await Customer.findOne({ phone: customerInfo.phone });
      if (customerRecord) {
        customerRecord.totalSpent += grandTotal;
        customerRecord.totalOrders += 1;
        if (customerInfo.name) customerRecord.name = customerInfo.name;
        if (customerInfo.address) customerRecord.address = customerInfo.address;
        await customerRecord.save();
      } else {
        customerRecord = await Customer.create({
          name: customerInfo.name || "Website Customer",
          phone: customerInfo.phone,
          email: customerInfo.email || "",
          address: customerInfo.address || "",
          totalSpent: grandTotal,
          totalOrders: 1,
        });
      }

      sale.customer = customerRecord._id;
      await sale.save();
    }
  } catch (error) {
    console.error("Failed to create/update customer:", error);
  }

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    let previousStock;
    let newStock;

    if (product.hasVariants && item.variantId) {
      const vIndex = product.variants.findIndex(
        (v) => v.variantId === item.variantId
      );
      if (vIndex !== -1) {
        previousStock = product.variants[vIndex].currentStock;
        product.variants[vIndex].currentStock = parseFloat(
          (product.variants[vIndex].currentStock - item.quantity).toFixed(6)
        );
        product.currentStock = parseFloat(
          (product.currentStock - item.quantity).toFixed(6)
        );
        newStock = product.variants[vIndex].currentStock;
      } else {
        previousStock = product.currentStock;
        product.currentStock = parseFloat(
          (product.currentStock - item.quantity).toFixed(6)
        );
        newStock = product.currentStock;
      }
    } else {
      previousStock = product.currentStock;
      product.currentStock = parseFloat(
        (product.currentStock - item.quantity).toFixed(6)
      );
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
      createdBy: null,
    });
  }

  return apiResponse({
    res,
    statusCode: 201,
    message: "Order placed successfully",
    data: sale,
  });
});
