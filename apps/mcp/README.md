# Pahar POS MCP Server

A modular MCP (Model Context Protocol) server implementation for the Pahar POS system.

## Project Structure

```text
src/
├── index.js           # Entry point
├── tools/             # Tool definitions and handlers
├── services/          # Business logic and external API calls
└── utils/             # Helper functions and shared utilities
```

## Setup

```bash
pnpm install
pnpm start
```

## Development

- **Adding a Tool**: Create a new file in `src/tools/`, define your tool and handler, then export it in `src/tools/index.js`.
- **Adding Logic**: Put reusable logic in `src/services/`.
- **Utilities**: Add helpers like custom loggers or formatters in `src/utils/`.

## Integration with opencode

The MCP server is configured in the root `opencode.json`. For manual integration, update the path in that file:

```json
{
  "mcpServers": {
    "pahar-pos": {
      "command": "node",
      "args": ["/absolute/path/to/pahartheke-v5/apps/mcp/src/index.js"]
    }
  }
}
```
