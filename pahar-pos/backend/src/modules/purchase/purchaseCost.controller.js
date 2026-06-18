import PurchaseCost from "./purchaseCost.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import apiResponse from "../../utils/apiResponse.js";
import ApiError from "../../core/ApiError.js";

export const createCost = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const exists = await PurchaseCost.findOne({ name });
  if (exists) {
    throw new ApiError(400, "Cost type already exists");
  }

  const cost = await PurchaseCost.create({ name, description });

  return apiResponse({
    res,
    statusCode: 201,
    message: "Cost type created",
    data: cost,
  });
});

export const getCosts = asyncHandler(async (req, res) => {
  const costs = await PurchaseCost.find().sort({ createdAt: -1 });

  return apiResponse({
    res,
    data: costs,
  });
});

export const updateCost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  const cost = await PurchaseCost.findById(id);
  if (!cost) {
    throw new ApiError(404, "Cost type not found");
  }

  if (name && name !== cost.name) {
    const exists = await PurchaseCost.findOne({ name });
    if (exists) {
      throw new ApiError(400, "Cost type already exists");
    }
    cost.name = name;
  }

  if (description !== undefined) cost.description = description;
  if (status !== undefined) cost.status = status;

  await cost.save();

  return apiResponse({
    res,
    message: "Cost type updated",
    data: cost,
  });
});

export const deleteCost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const cost = await PurchaseCost.findById(id);
  if (!cost) {
    throw new ApiError(404, "Cost type not found");
  }

  await cost.deleteOne();

  return apiResponse({
    res,
    message: "Cost type deleted",
  });
});
