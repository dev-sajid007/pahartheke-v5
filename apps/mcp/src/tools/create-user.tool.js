import { UserService } from "../services/user.service.js";
export const createUserTool = {
  name: "create_user",
  description: "Create a new POS user/staff account",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Full name" },
      email: { type: "string", description: "Email address (unique)" },
      password: { type: "string", description: "Password" },
      role: { type: "string", enum: ["admin", "manager", "cashier"], default: "cashier" },
    },
    required: ["name", "email", "password"],
  },
  handler: async (args) => {
    try {
      const user = await UserService.create(args);
      return { content: [{ type: "text", text: `👤 User "${user.name}" created (Role: ${user.role})` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
