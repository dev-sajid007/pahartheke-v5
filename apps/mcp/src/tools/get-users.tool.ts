import { UserService } from "../services/user.service.js";
import type { ToolDefinition } from "../types.js";
export const getUsersTool: ToolDefinition = {
  name: "get_users",
  description: "Retrieve all POS users/staff",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    try {
      const users = await UserService.getAll();
      return { content: [{ type: "text", text: `👥 Staff (${users.length}):\n` + users.map(u => `- ${u.name} (${u.email}) — ${u.role}`).join("\n") }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  }
};
