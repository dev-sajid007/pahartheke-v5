import { UserService } from "../services/user.service.js";
import type { ToolDefinition } from "../types.js";

export const updateUserTool: ToolDefinition = {
  name: "update_user",
  description: "Update an existing POS user/staff account",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "User MongoDB ObjectId" },
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      role: { type: "string", enum: ["admin", "manager", "cashier"] },
      isActive: { type: "boolean" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      const { id, ...data } = args;
      const u = await UserService.update(id, data);
      return { content: [{ type: "text", text: `User "${u.name}" updated` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
