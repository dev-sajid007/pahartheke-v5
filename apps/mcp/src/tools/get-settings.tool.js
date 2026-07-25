import { SettingsService } from "../services/settings.service.js";

export const getSettingsTool = {
  name: "get_settings",
  description: "Get Pahar POS store settings",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    try {
      const settings = await SettingsService.get();
      return { content: [{ type: "text", text: JSON.stringify(settings, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
