import mongoose from "mongoose";

import Category from "./category.model.js";

import { getDescendantIds, buildPathSlug } from "./category.helper.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

import ApiError from "../../core/ApiError.js";

const validateParent = async (parentId) => {
  if (!parentId) return null;

  if (!mongoose.isValidObjectId(parentId)) {
    throw new ApiError(400, "Invalid parent category");
  }

  const parent = await Category.findById(parentId);

  if (!parent) {
    throw new ApiError(400, "Parent category not found");
  }

  return parent;
};

export const createCategory = asyncHandler(
  async (req, res) => {
    const { name, parent, description } = req.body;

    const parentCategory = await validateParent(parent);

    const exists = await Category.findOne({
      name,
      parent: parentCategory?._id || null,
    });

    if (exists) {
      throw new ApiError(
        400,
        "Category already exists"
      );
    }

    const categoryData = {
      name,
      slug: await buildPathSlug(parentCategory?._id || null, name),
      parent: parentCategory?._id || null,
    };

    if (description !== undefined) {
      categoryData.description = description;
    }

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
    const categories = await Category.find()
      .populate("parent", "name slug")
      .sort({
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
    const { name, parent, description, status } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const parentCategory = await validateParent(parent);

    if (
      parentCategory &&
      String(parentCategory._id) === String(category._id)
    ) {
      throw new ApiError(400, "Category cannot be its own parent");
    }

    if (parentCategory) {
      const descendantIds = await getDescendantIds(category._id);

      if (
        descendantIds.some(
          (descId) => String(descId) === String(parentCategory._id)
        )
      ) {
        throw new ApiError(
          400,
          "Category cannot be moved under its own subcategory"
        );
      }
    }

    const newParent = parentCategory?._id || null;
    const parentChanged =
      parent !== undefined &&
      String(newParent || null) !== String(category.parent || null);

    if (name && name !== category.name) {
      const exists = await Category.findOne({
        name,
        parent: parent !== undefined ? newParent : category.parent || null,
        _id: { $ne: category._id },
      });
      if (exists) {
        throw new ApiError(400, "Category already exists");
      }
      category.name = name;
    }

    if (name || parentChanged) {
      category.slug = await buildPathSlug(
        parent !== undefined ? newParent : category.parent,
        category.name
      );
    }

    if (parent !== undefined) category.parent = newParent;
    if (status !== undefined) category.status = status;
    if (description !== undefined) category.description = description;
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

    const hasChildren = await Category.exists({ parent: category._id });

    if (hasChildren) {
      throw new ApiError(
        400,
        "Delete or move its subcategories first"
      );
    }

    await category.deleteOne();

    return apiResponse({
      res,
      statusCode: 200,
      message: "Category deleted",
    });
  }
);
