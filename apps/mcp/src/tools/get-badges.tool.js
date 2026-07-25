import { BadgeService } from "../services/badge.service.js";
export const getBadgesTool = {
  name: "get_badges",
  description: "Retrieve all customer badges from Pahar POS",
  inputSchema: { type: "object", properties: {} },
  handler: async (args) => {
    try {
      const badges = await BadgeService.getAll();
      return { content: [{ type: "text", text: badges.length === 0 ? "No badges found." : `🏅 Badges:\n` + badges.map(b => `- ${b.name} | Discount: ${b.discount}% | Conditions: ${(b.conditions || []).map(c => `${c.field} ${c.operator} ${c.value}`).join(", ") || "none"}`).join("\n") }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
