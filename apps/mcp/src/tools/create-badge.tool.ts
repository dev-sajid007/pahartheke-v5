import { BadgeService } from "../services/badge.service.js";
import type { ToolDefinition } from "../types.js";

export const createBadgeTool: ToolDefinition = {
  name: "create_badge",
  description: "Create a customer badge in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Badge name (e.g., Gold Customer)" },
      description: { type: "string" },
      icon: { type: "string", default: "Award" },
      discount: { type: "number", default: 0 },
      conditions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            field: { type: "string", enum: ["totalOrders", "totalSpent"] },
            operator: { type: "string", enum: ["gt", "lt", "gte", "lte", "eq"] },
            value: { type: "number" },
          },
        },
      },
      color: { type: "string", default: "#3b82f6" },
    },
    required: ["name"],
  },
  handler: async (args) => {
    try {
      const b = await BadgeService.create(args);
      return { content: [{ type: "text", text: `Badge "${b.name}" created` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
