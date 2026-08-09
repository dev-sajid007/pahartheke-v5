# Pahar POS MCP Server

A modular MCP (Model Context Protocol) server written in **TypeScript** for the Pahar POS system. Serves over **Streamable HTTP** (Express 5) on port `4002`.

## Project Structure

```text
src/
├── index.ts           # Express + Streamable HTTP MCP server entry
├── types.ts           # Shared types (ToolDefinition, model interfaces)
├── tools/             # Tool definitions and handlers (55 tools)
├── services/          # Business logic and MongoDB access (Mongoose 9)
└── utils/             # Helper functions and shared utilities
```

## Setup

```bash
pnpm install
pnpm --filter pahar-pos-mcp-server build
pnpm --filter pahar-pos-mcp-server start
```

## Development

```bash
pnpm --filter pahar-pos-mcp-server dev   # tsx watch — auto-reloads on change
pnpm --filter pahar-pos-mcp-server build # compile TS -> dist/
pnpm --filter pahar-pos-mcp-server start # run node dist/index.js
```

- **Adding a Tool**: Create a new file in `src/tools/` typed as `ToolDefinition` (`{ name, description, inputSchema, handler }`), then export it in `src/tools/index.ts`.
- **Adding Logic**: Put reusable logic in `src/services/`.
- **Utilities**: Add helpers like custom loggers or formatters in `src/utils/`.

## Integration with opencode

The MCP server is configured in the root `opencode.json`. It runs over Streamable HTTP on port `4002`:

```json
{
  "mcpServers": {
    "pahar-pos": {
      "type": "http",
      "url": "http://localhost:4002/mcp"
    }
  }
}
```

Build and start the server with `pnpm dev:mcp` before connecting.
