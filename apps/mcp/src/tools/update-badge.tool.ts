import { BadgeService } from "../services/badge.service.js";
import type { ToolDefinition } from "../types.js";

export const updateBadgeTool: ToolDefinition = {
  name: "update_badge",
  description: "Update an existing customer badge in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Badge MongoDB ObjectId" },
      name: { type: "string" },
      description: { type: "string" },
      icon: { type: "string" },
      discount: { type: "number" },
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
      color: { type: "string" },
      status: { type: "boolean" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      const { id, ...data } = args;
      const b = await BadgeService.update(id, data);
      return { content: [{ type: "text", text: `Badge "${b.name}" updated` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
