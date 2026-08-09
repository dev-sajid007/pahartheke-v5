import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export type ToolDefinition = Tool & {
  handler: (args: any) => Promise<CallToolResult>;
};
