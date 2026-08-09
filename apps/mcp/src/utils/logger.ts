/**
 * Simple logger utility to keep standard output clean for MCP communication
 */
export const logger = {
  log: (...args: unknown[]) => console.error("[LOG]:", ...args),
  error: (...args: unknown[]) => console.error("[ERROR]:", ...args),
  info: (...args: unknown[]) => console.error("[INFO]:", ...args),
};
