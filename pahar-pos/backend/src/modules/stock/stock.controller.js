import StockMovement from "./stockMovement.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

export const getStockMovements =
  asyncHandler(async (req, res) => {
    const movements =
      await StockMovement.find()
        .populate(
          "product",
          "name sku"
        )
        .populate(
          "createdBy",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    return apiResponse({
      res,
      data: movements,
    });
  });
