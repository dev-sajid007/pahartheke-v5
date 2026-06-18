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

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

## Development

- **Adding a Tool**: Create a new file in `src/tools/`, define your tool and handler, then export it in `src/tools/index.js`.
- **Adding Logic**: Put reusable logic in `src/services/`.
- **Utilities**: Add helpers like custom loggers or formatters in `src/utils/`.

## Integration
To use this with Claude Desktop, add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pahar-pos": {
      "command": "node",
      "args": ["/home/allex/Desktop/Pahar Theke/pahar-pos/mcp-server/src/index.js"]
    }
  }
}
```
