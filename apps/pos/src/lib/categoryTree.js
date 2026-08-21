export const buildCategoryTree = (categories) => {
  const map = {};
  const roots = [];

  categories.forEach((cat) => {
    map[cat._id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    const node = map[cat._id];
    const parentId = cat.parent?._id || cat.parent;
    if (parentId && map[parentId]) {
      map[parentId].children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const flattenCategoryTree = (roots, depth = 0, result = []) => {
  roots.forEach((node) => {
    result.push({ ...node, depth });
    if (node.children.length > 0) {
      flattenCategoryTree(node.children, depth + 1, result);
    }
  });

  return result;
};

export const getDescendantIds = (categories, id) => {
  const descendants = [];
  let frontier = [id];

  while (frontier.length > 0) {
    const children = categories.filter(
      (cat) =>
        frontier.includes(cat.parent?._id) || frontier.includes(cat.parent)
    );
    const childIds = children.map((child) => child._id);
    descendants.push(...childIds);
    frontier = childIds;
  }

  return descendants;
};

export const getCategoryPath = (categories, category) => {
  const path = [];
  let current = category;

  while (current) {
    path.unshift(current.name);
    const parentId = current.parent?._id || current.parent;
    current = parentId
      ? categories.find((cat) => cat._id === parentId)
      : null;
  }

  return path.join(" / ");
};
