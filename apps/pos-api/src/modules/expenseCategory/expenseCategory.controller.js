import slugify from "slugify";

import ExpenseCategory from "./expenseCategory.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

import ApiError from "../../core/ApiError.js";

export const createExpenseCategory = asyncHandler(
  async (req, res) => {
    const { name, description } = req.body;

    const exists = await ExpenseCategory.findOne({ name });
    if (exists) {
      throw new ApiError(400, "Expense category already exists");
    }

    const category = await ExpenseCategory.create({
      name,
      slug: slugify(name, { lower: true }),
      description,
    });

    return apiResponse({
      res,
      statusCode: 201,
      message: "Expense category created",
      data: category,
    });
  }
);

export const getExpenseCategories = asyncHandler(
  async (req, res) => {
    const categories = await ExpenseCategory.find().sort({ createdAt: -1 });

    return apiResponse({
      res,
      data: categories,
    });
  }
);

export const updateExpenseCategory = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const category = await ExpenseCategory.findById(id);
    if (!category) {
      throw new ApiError(404, "Expense category not found");
    }

    if (name && name !== category.name) {
      const exists = await ExpenseCategory.findOne({ name });
      if (exists) {
        throw new ApiError(400, "Expense category already exists");
      }
      category.name = name;
      category.slug = slugify(name, { lower: true });
    }

    if (description !== undefined) category.description = description;
    if (status !== undefined) category.status = status;

    await category.save();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Expense category updated",
      data: category,
    });
  }
);

export const deleteExpenseCategory = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const category = await ExpenseCategory.findById(id);
    if (!category) {
      throw new ApiError(404, "Expense category not found");
    }

    await category.deleteOne();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Expense category deleted",
    });
  }
);
