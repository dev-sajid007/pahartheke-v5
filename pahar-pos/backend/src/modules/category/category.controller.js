import slugify from "slugify";

import Category from "./category.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

import ApiError from "../../core/ApiError.js";

export const createCategory = asyncHandler(
  async (req, res) => {
    const { name } = req.body;

    const exists = await Category.findOne({ name });

    if (exists) {
      throw new ApiError(
        400,
        "Category already exists"
      );
    }

    const categoryData = {
      name,
      slug: slugify(name, { lower: true }),
    };

    if (req.file) {
      categoryData.image = req.file.path;
    }

    const category = await Category.create(categoryData);

    return apiResponse({
      res,
      statusCode: 201,
      message: "Category created",
      data: category,
    });
  }
);

export const getCategories = asyncHandler(
  async (req, res) => {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    return apiResponse({
      res,
      data: categories,
    });
  }
);

export const updateCategory = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const { name, status } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    if (name && name !== category.name) {
      const exists = await Category.findOne({ name });
      if (exists) {
        throw new ApiError(400, "Category already exists");
      }
      category.name = name;
      category.slug = slugify(name, { lower: true });
    }

    if (status !== undefined) category.status = status;
    if (req.file) category.image = req.file.path;

    await category.save();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Category updated",
      data: category,
    });
  }
);

export const deleteCategory = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    await category.deleteOne();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Category deleted",
    });
  }
);
