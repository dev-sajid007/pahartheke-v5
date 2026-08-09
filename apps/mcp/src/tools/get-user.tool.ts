import { UserService } from "../services/user.service.js";
import type { ToolDefinition } from "../types.js";

export const getUserTool: ToolDefinition = {
  name: "get_user",
  description: "Get a single POS user by MongoDB ObjectId",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "User MongoDB ObjectId" },
    },
    required: ["id"],
  },
  handler: async ({ id }) => {
    try {
      const user = await UserService.getById(id);
      return { content: [{ type: "text", text: JSON.stringify(user, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
