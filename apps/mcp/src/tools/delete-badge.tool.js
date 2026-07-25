import { BadgeService } from "../services/badge.service.js";

export const deleteBadgeTool = {
  name: "delete_badge",
  description: "Delete a badge from Pahar POS by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Badge MongoDB ObjectId" },
    },
    required: ["id"],
  },
  handler: async ({ id }) => {
    try {
      const result = await BadgeService.delete(id);
      return { content: [{ type: "text", text: `Badge deleted successfully` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
