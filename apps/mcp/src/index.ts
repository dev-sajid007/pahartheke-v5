import { randomUUID } from "crypto";
import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { tools, getToolByName } from "./tools/index.js";
import { logger } from "./utils/logger.js";
import { connectDB } from "./utils/db.js";

const PORT = process.env.PORT || 4002;

/**
 * Create a configured MCP server instance
 */
function createMcpServer(): Server {
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

  return server;
}

const transports = new Map<string, StreamableHTTPServerTransport>();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const transport = sessionId ? transports.get(sessionId) : undefined;
  if (!transport) {
    res.status(400).json({ error: "No transport found for session ID" });
    return;
  }
  await transport.handleRequest(req, res);
});

app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  let transport = sessionId ? transports.get(sessionId) : undefined;

  if (sessionId && !transport) {
    res.status(404).json({ error: "Invalid session ID" });
    return;
  }

  if (!transport) {
    const newTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: randomUUID,
      onsessioninitialized: (id) => {
        transports.set(id, newTransport);
      },
      onsessionclosed: (id) => {
        transports.delete(id);
      },
    });
    transport = newTransport;
    const server = createMcpServer();
    await server.connect(transport);
  }

  await transport.handleRequest(req, res, req.body);
});

app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const transport = sessionId ? transports.get(sessionId) : undefined;
  if (!transport) {
    res.status(400).json({ error: "No transport found for session ID" });
    return;
  }
  transports.delete(sessionId!);
  await transport.close();
  res.status(200).json({});
});

/**
 * Start the server
 */
async function run() {
  await connectDB().catch(err => logger.error("Initial DB connection failed:", (err as Error).message));

  app.listen(PORT, () => {
    logger.info(`Pahar POS MCP server running on http://localhost:${PORT}/mcp`);
  });
}

run().catch((error) => {
  logger.error("Fatal error:", error);
  process.exit(1);
});
