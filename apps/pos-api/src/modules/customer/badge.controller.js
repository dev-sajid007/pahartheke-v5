import Badge from "./badge.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import apiResponse from "../../utils/apiResponse.js";
import ApiError from "../../core/ApiError.js";

export const createBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.create(req.body);
  return apiResponse({
    res,
    statusCode: 201,
    message: "Badge created successfully",
    data: badge,
  });
});

import Customer from "./customer.model.js";

export const getBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.aggregate([
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "badge",
        as: "customers"
      }
    },
    {
      $addFields: {
        customerCount: { $size: "$customers" }
      }
    },
    { $project: { customers: 0 } },
    { $sort: { discount: 1 } }
  ]);

  return apiResponse({
    res,
    data: badges,
  });
});

export const updateBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!badge) throw new ApiError(404, "Badge not found");
  return apiResponse({
    res,
    message: "Badge updated successfully",
    data: badge,
  });
});

export const deleteBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findByIdAndDelete(req.params.id);
  if (!badge) throw new ApiError(404, "Badge not found");
  return apiResponse({
    res,
    message: "Badge deleted successfully",
  });
});
