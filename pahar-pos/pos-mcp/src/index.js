import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { tools, getToolByName } from "./tools/index.js";
import { logger } from "./utils/logger.js";
import { connectDB } from "./utils/db.js";

/**
 * Initialize the MCP Server
 */
const server = new Server(
  {
    name: "pahar-pos-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Define available tools from registry
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.info("Listing tools...");
  return {
    tools: tools.map(({ name, description, inputSchema }) => ({
      name,
      description,
      inputSchema,
    })),
  };
});

/**
 * Handle tool execution from registry
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  logger.info(`Calling tool: ${name}`);

  const tool = getToolByName(name);
  if (!tool) {
    logger.error(`Tool not found: ${name}`);
    throw new Error(`Tool not found: ${name}`);
  }

  try {
    return await tool.handler(args);
  } catch (error) {
    logger.error(`Error executing tool ${name}:`, error);
    throw error;
  }
});

/**
 * Start the server
 */
async function run() {
  // Pre-connect to database
  await connectDB().catch(err => logger.error("Initial DB connection failed:", err.message));
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("Pahar POS MCP server running on stdio");
}

run().catch((error) => {
  logger.error("Fatal error:", error);
  process.exit(1);
});
