/**
 * Simple logger utility to keep standard output clean for MCP communication
 */
export const logger = {
  log: (...args) => console.error("[LOG]:", ...args),
  error: (...args) => console.error("[ERROR]:", ...args),
  info: (...args) => console.error("[INFO]:", ...args),
};
