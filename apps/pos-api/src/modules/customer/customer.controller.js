import Customer from "./customer.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

import ApiError from "../../core/ApiError.js";

export const createCustomer = asyncHandler(
  async (req, res) => {
    const { phone } = req.body;

    const exists = await Customer.findOne({
      phone,
    });

    if (exists) {
      throw new ApiError(
        400,
        "Customer already exists"
      );
    }

    const customer = await Customer.create(
      req.body
    );

    return apiResponse({
      res,
      statusCode: 201,
      message: "Customer created successfully",
      data: customer,
    });
  }
);

export const getCustomers = asyncHandler(
  async (req, res) => {
    const { all, search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (all === "true") {
      const customers = await Customer.find(filter)
        .populate("badge")
        .sort({ createdAt: -1 });

      return apiResponse({
        res,
        data: customers,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      Customer.find(filter)
        .populate("badge")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Customer.countDocuments(filter),
    ]);

    return apiResponse({
      res,
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  }
);

export const getSingleCustomer =
  asyncHandler(async (req, res) => {
    const customer =
      await Customer.findById(req.params.id).populate("badge");

    if (!customer) {
      throw new ApiError(
        404,
        "Customer not found"
      );
    }

    return apiResponse({
      res,
      data: customer,
    });
  });

export const updateCustomer = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    
    const customer = await Customer.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }

    return apiResponse({
      res,
      statusCode: 200,
      message: "Customer updated",
      data: customer,
    });
  }
);

export const deleteCustomer = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    
    const customer = await Customer.findById(id);

    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }

    await customer.deleteOne();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Customer deleted",
    });
  }
);
