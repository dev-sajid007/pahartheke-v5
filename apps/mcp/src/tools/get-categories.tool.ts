import { CategoryService } from "../services/category.service.js";
import type { ToolDefinition } from "../types.js";

const buildTree = (categories: any[]) => {
  const map = new Map<string, any>();
  categories.forEach((cat) => map.set(String(cat._id), { ...cat, children: [] }));

  const roots: any[] = [];
  categories.forEach((cat) => {
    const node = map.get(String(cat._id));
    const parentId = cat.parent?._id ? String(cat.parent._id) : null;
    if (parentId && map.has(parentId)) {
      map.get(parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  const render = (nodes: any[], depth: number): string =>
    nodes
      .map((n) => {
        const line = `${"  ".repeat(depth)}- ${n.name} (Slug: ${n.slug})`;
        return [line, ...render(n.children, depth + 1)].join("\n");
      })
      .join("\n");

  return render(roots, 0);
};

export const getCategoriesTool: ToolDefinition = {
  name: "get_categories",
  description: "Retrieve all active product categories from the Pahar POS system, shown as a hierarchy with subcategories",
  inputSchema: {
    type: "object",
    properties: {},
  },

  handler: async () => {
    const categories = await CategoryService.getAllCategories();

    if (categories.length === 0) {
      return {
        content: [{ type: "text", text: "No active categories found." }],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Found ${categories.length} categories:\n\n${buildTree(categories)}`,
        },
      ],
    };
  }
};
