import slugify from "slugify";

import Category from "./category.model.js";

export const getDescendantIds = async (parentId) => {
  const descendantIds = [];
  let frontier = [parentId];

  while (frontier.length > 0) {
    const children = await Category.find({
      parent: { $in: frontier },
    }).select("_id");

    if (children.length === 0) break;

    const childIds = children.map((child) => child._id);
    descendantIds.push(...childIds);
    frontier = childIds;
  }

  return descendantIds;
};

export const buildPathSlug = async (parentId, name) => {
  const baseSlug = slugify(name, { lower: true });

  if (!parentId) return baseSlug;

  const parent = await Category.findById(parentId).select("slug");

  if (!parent) return baseSlug;

  return `${parent.slug}-${baseSlug}`;
};
