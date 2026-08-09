import { BadgeService } from "../services/badge.service.js";
import type { ToolDefinition } from "../types.js";
export const getBadgesTool: ToolDefinition = {
  name: "get_badges",
  description: "Retrieve all customer badges from Pahar POS",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    try {
      const badges = await BadgeService.getAll();
      return { content: [{ type: "text", text: badges.length === 0 ? "No badges found." : `🏅 Badges:\n` + badges.map(b => `- ${b.name} | Discount: ${b.discount}% | Conditions: ${(b.conditions || []).map((c: any) => `${c.field} ${c.operator} ${c.value}`).join(", ") || "none"}`).join("\n") }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  }
};
