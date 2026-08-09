import { SettingsService } from "../services/settings.service.js";
import type { ToolDefinition } from "../types.js";

export const updateSettingsTool: ToolDefinition = {
  name: "update_settings",
  description: "Update Pahar POS store settings",
  inputSchema: {
    type: "object",
    properties: {
      storeName: { type: "string" },
      contactPhone: { type: "string" },
      storeAddress: { type: "string" },
      invoicePrefix: { type: "string" },
      taxRate: { type: "number" },
      invoiceFooterMessage: { type: "string" },
      logo: { type: "string" },
    },
  },
  handler: async (args) => {
    try {
      const settings = await SettingsService.update(args);
      return { content: [{ type: "text", text: `Settings updated successfully` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
