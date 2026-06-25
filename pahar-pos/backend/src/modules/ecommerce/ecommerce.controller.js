import Category from "../category/category.model.js";
import Product from "../product/product.model.js";
import Sale from "../sale/sale.model.js";
import PurchaseBatch from "../product/purchaseBatch.model.js";
import createStockMovement from "../../helpers/createStockMovement.js";
import asyncHandler from "../../utils/asyncHandler.js";
import apiResponse from "../../utils/apiResponse.js";
import ApiError from "../../core/ApiError.js";

const generateInvoice = () => {
  return "WEB-" + Date.now();
};

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: true }).sort({ createdAt: -1 });

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
      filter.category = cat._id;
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
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name slug image"
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return apiResponse({
    res,
    data: product,
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { items, customerInfo, note } = req.body;

  if (!items || !items.length) {
    throw new ApiError(400, "No items in order");
  }

  let subtotal = 0;
  let totalCost = 0;
  let totalProfit = 0;
  const saleItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ApiError(404, `Product not found: ${item.product}`);
    }

    if (!product.status) {
      throw new ApiError(400, `Product is unavailable: ${product.name}`);
    }

    if (product.hasVariants && item.variantId) {
      const variant = product.variants.find(
        (v) => v.variantId === item.variantId
      );
      if (!variant || variant.currentStock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name} (${item.variantName || "Selected Variant"})`
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

    const batches = await PurchaseBatch.find(batchQuery).sort({
      createdAt: 1,
    });

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

    if (remainingQty > 0.0001) {
      throw new ApiError(
        400,
        `Batch stock mismatch for ${product.name}`
      );
    }

    const salePrice = item.salePrice || product.salePrice;
    const itemSubtotal = item.quantity * salePrice;
    const itemProfit = itemSubtotal - itemCost;

    subtotal += itemSubtotal;
    totalCost += itemCost;
    totalProfit += itemProfit;

    let previousStock;
    let newStock;

    if (product.hasVariants && item.variantId) {
      const vIndex = product.variants.findIndex(
        (v) => v.variantId === item.variantId
      );
      previousStock = product.variants[vIndex].currentStock;
      product.variants[vIndex].currentStock = parseFloat(
        (
          product.variants[vIndex].currentStock - item.quantity
        ).toFixed(6)
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

    await product.save();

    await createStockMovement({
      product: product._id,
      variantId: item.variantId,
      type: "sale",
      quantity: item.quantity,
      previousStock,
      newStock,
      referenceId: null,
      createdBy: null,
    });

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

  const grandTotal = subtotal;
  const paidAmount = grandTotal;
  const dueAmount = 0;

  const sale = await Sale.create({
    invoiceNo: generateInvoice(),
    items: saleItems,
    subtotal,
    discount: 0,
    grandTotal,
    paidAmount,
    dueAmount,
    totalCost,
    totalProfit,
    note: note || "Order from website",
    source: "website",
    order_date: new Date(),
  });

  return apiResponse({
    res,
    statusCode: 201,
    message: "Order placed successfully",
    data: sale,
  });
});
