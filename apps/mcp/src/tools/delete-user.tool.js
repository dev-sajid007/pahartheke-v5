import { UserService } from "../services/user.service.js";
export const deleteUserTool = {
  name: "delete_user",
  description: "Deactivate a POS user",
  inputSchema: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      await UserService.delete(args.id);
      return { content: [{ type: "text", text: "User deactivated" }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
