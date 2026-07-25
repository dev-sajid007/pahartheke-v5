import Expense from "./expense.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

export const createExpense =
  asyncHandler(async (req, res) => {
    const expense = await Expense.create({
      ...req.body,
      createdBy: req.user._id,
    });

    return apiResponse({
      res,
      statusCode: 201,
      message: "Expense added successfully",
      data: expense,
    });
  });

export const getExpenses = asyncHandler(
  async (req, res) => {
    const expenses = await Expense.find()
      .populate("createdBy", "name")
      .populate("category", "name slug")
      .sort({
        createdAt: -1,
      });

    return apiResponse({
      res,
      data: expenses,
    });
  }
);

import ApiError from "../../core/ApiError.js";

export const updateExpense = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    
    const expense = await Expense.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      throw new ApiError(404, "Expense not found");
    }

    return apiResponse({
      res,
      statusCode: 200,
      message: "Expense updated",
      data: expense,
    });
  }
);

export const deleteExpense = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    
    const expense = await Expense.findById(id);

    if (!expense) {
      throw new ApiError(404, "Expense not found");
    }

    await expense.deleteOne();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Expense deleted",
    });
  }
);
