import Supplier from "./supplier.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

import ApiError from "../../core/ApiError.js";

export const createSupplier =
  asyncHandler(async (req, res) => {
    const { phone } = req.body;

    const exists = await Supplier.findOne({
      phone,
    });

    if (exists) {
      throw new ApiError(
        400,
        "Supplier already exists"
      );
    }

    const supplier = await Supplier.create(
      req.body
    );

    return apiResponse({
      res,
      statusCode: 201,
      message: "Supplier created successfully",
      data: supplier,
    });
  });

export const getSuppliers = asyncHandler(
  async (req, res) => {
    const suppliers =
      await Supplier.find().sort({
        createdAt: -1,
      });

    return apiResponse({
      res,
      data: suppliers,
    });
  }
);

export const updateSupplier = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    
    const supplier = await Supplier.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      throw new ApiError(404, "Supplier not found");
    }

    return apiResponse({
      res,
      statusCode: 200,
      message: "Supplier updated",
      data: supplier,
    });
  }
);

export const deleteSupplier = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    
    const supplier = await Supplier.findById(id);

    if (!supplier) {
      throw new ApiError(404, "Supplier not found");
    }

    await supplier.deleteOne();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Supplier deleted",
    });
  }
);
