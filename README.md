# 🚀 MCP Boilerplate

[![Node.js](https://img.shields.io/badge/Node.js-^26.3-green?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-^5-blue?logo=typescript)](https://www.typescriptlang.org)
[![MCP SDK](https://img.shields.io/badge/MCP%20SDK-^1.29.0-purple)](https://modelcontextprotocol.io)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

A modern and extensible boilerplate for building **Model Context Protocol (MCP)** servers in TypeScript. Start quickly with your own MCP server with well-structured architecture ready for production.

---

## 📖 What is the Model Context Protocol (MCP)?

The **Model Context Protocol** is an open standard created by Anthropic that enables AI models (like Claude) and applications to access external resources in a secure and standardized way.

### Key Concepts:

- **MCP Server**: An application that exposes functionality (tools, resources, data) via the MCP protocol
- **MCP Client**: An AI or application that connects to the server to use its features
- **Transport**: The communication channel (stdio, HTTP, etc.)
- **Tools**: Executable functions that the server exposes (e.g., fetching data, performing actions)

### Use Cases:

- ✅ Connect Claude to your business APIs
- ✅ Automate complex tasks via AI
- ✅ Give Claude access to your real-time data
- ✅ Create custom AI assistants

[Learn more about MCP →](https://modelcontextprotocol.io)

---

## 🎯 About This Project

This boilerplate provides a solid foundation for building a production-ready MCP server with:

| Feature                          | Description                                   |
| -------------------------------- | --------------------------------------------- |
| 🔧 **Tools System**              | Extensible architecture to add your own tools |
| 🌐 **HTTP & Stdio Support**      | Two transport modes for MCP integration       |
| 📦 **Centralized Configuration** | Easy environment variable management          |
| 🧹 **Structured Code**           | Clear organization for maintainability        |
| 📝 **Built-in Logging**          | Logging system for debugging                  |
| ⚡ **Example Included**          | "Parkings" tool as a functional example       |

---

## 📁 Project Structure

```
mcp-boilerplate/
├── src/
│   ├── index.ts               # Main entry point
│   ├── server.ts              # MCP server & transport configuration
│   ├── config.ts              # Centralized configuration
│   ├── tools/
│   │   ├── index.ts           # Export all tools
│   │   └── parking/
│   │       ├── index.ts       # Export parkings tool
│   │       └── getParkings.ts # Tool implementation
│   ├── types/
│   │   └── tool.ts            # TypeScript definitions for tools
│   └── utils/
│       ├── logger.ts          # Logging utility
│       └── http.ts            # HTTP utilities
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Example environment variables
└── README.md                  
```

### Folder Purpose:

- **`src/tools/`**: Add your tools here (create one folder per tool)
- **`src/types/`**: Reusable TypeScript definitions
- **`src/utils/`**: Shared utility functions

---

## 🚀 Quick Start

### Prerequisites

- npm or bun

### Installation

```bash
# Clone the project
git clone <your-repo>
cd mcp-boilerplate

# Install dependencies
npm install
# or with bun
bun install
```

### Launch the Server

```bash
# Start the server (compile + run)
npm start

# Or just run after manual compilation
npm run build
npm run start:server
```

The server starts on `http://localhost:3000` in HTTP mode.

---

## ⚙️ Environment Configuration

### Using Environment Variables

This project uses **Zod** for schema validation and type safety on environment variables. All configuration is centralized in `src/config.ts`.

### Available Configuration Variables

```typescript
// Default values are shown
MCP_SERVER_NAME=mcp-boilerplate      # Server name
MCP_SERVER_VERSION=1.0.0               # Server version
MCP_MODE=stdio                         # Transport mode: "stdio" or "http"
HOST=127.0.0.1                         # Server host (HTTP mode)
PORT=8004                              # Server port (HTTP mode)
LOG_LEVEL=info                         # Log level: "debug", "info", "error"
API_BASE_URL=                          # Your API base URL (required)
```

### Setup with .env File

#### 1. Create a `.env` file from the example:

```bash
cp .env.example .env
```

#### 2. Create `.env.example` in your project root:

```env
# MCP Server Configuration
MCP_SERVER_NAME=my-mcp-server
MCP_SERVER_VERSION=1.0.0
MCP_MODE=http

# Server Settings
HOST=127.0.0.1
PORT=8004
LOG_LEVEL=debug

# External APIs
API_BASE_URL=https://api.example.com
```

#### 3. Create the `.env` file in the project root for local development:

```env
# MCP Server Configuration
MCP_SERVER_NAME=my-mcp-server
MCP_SERVER_VERSION=1.0.0
MCP_MODE=http

# Server Settings
HOST=localhost
PORT=3000
LOG_LEVEL=info

# External APIs
API_BASE_URL=https://api.example.com
YOUR_API_KEY=your-secret-key-here
CUSTOM_VARIABLE=custom-value
```

### Adding Custom Variables

#### 1. Update `src/config.ts` with your new variables:

```typescript
import { z } from 'zod';

const schema = z.object({
    MCP_SERVER_NAME: z.string().optional().default('mcp-boilerplate'),
    MCP_SERVER_VERSION: z.string().optional().default('1.0.0'),
    MCP_MODE: z.enum(['stdio', 'http']).default('stdio'),
    HOST: z.string().optional().default('127.0.0.1'),
    PORT: z.string().optional().default('8004'),
    LOG_LEVEL: z.enum(['debug', 'info', 'error']).default('info'),
    API_BASE_URL: z.string(),
    // 👇 Add your custom variables here
    DATABASE_URL: z.string().optional(),
    JWT_SECRET: z.string().optional(),
    CUSTOM_API_KEY: z.string().optional(),
});

export const config = schema.parse(process.env);
```

#### 2. Use your variables in your code:

```typescript
import { config } from '@/config';

console.log(config.DATABASE_URL);
console.log(config.JWT_SECRET);
console.log(config.CUSTOM_API_KEY);
```

#### 3. Add to `.env` and `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Security
JWT_SECRET=your-secret-key

# Custom API
CUSTOM_API_KEY=api-key-value
```

### Environment Variable Best Practices

✅ **DO:**

- Keep `.env` in `.gitignore` (sensitive data)
- Commit `.env.example` with default/placeholder values
- Use meaningful variable names (e.g., `DATABASE_URL` not `DB`)
- Set defaults in Zod schema when possible
- Validate types with Zod

❌ **DON'T:**

- Commit `.env` file to git
- Store secrets in code
- Use same values for dev/prod
- Leave required variables undefined

### Load Variables with Node

The configuration is automatically loaded when importing from `@/config`:

```typescript
import { config } from '@/config';

// All env variables are now typed and validated
console.log(config.API_BASE_URL); // ✅ Type-safe
console.log(process.env.API_BASE_URL); // ❌ Unsafe, use config instead
```

---

## 🛠️ Add Your First Tool

### 1. Create the tool structure

Create a new folder in `src/tools/`:

```bash
mkdir src/tools/mytool
touch src/tools/mytool/index.ts
touch src/tools/mytool/mytool.ts
```

### 2. Implement the tool

**`src/tools/mytool/mytool.ts`**:

```typescript
import type { Tool } from '@/types/tool';

export const myTool: Tool = {
    name: 'mytool',
    description: 'Description of my tool',
    inputSchema: {
        type: 'object',
        properties: {
            param1: {
                type: 'string',
                description: 'The first parameter',
            },
        },
        required: ['param1'],
    },
    outputSchema: {
        type: 'object',
        properties: {
            result: { type: 'string' },
        },
    },
    handler: async (input: Record<string, unknown>) => {
        const param1 = input.param1 as string;
        return {
            result: `Result for ${param1}`,
        };
    },
};
```

### 3. Export the tool

**`src/tools/mytool/index.ts`**:

```typescript
import { myTool } from './mytool';

export const mytools = [myTool];
```

### 4. Register in the main list

**`src/tools/index.ts`**:

```typescript
import type { Tool } from '@/types/tool';
import { parkingTools } from './parking';
import { mytools } from './mytool'; // ← Add

export const allTools: Tool[] = [
    ...parkingTools,
    ...mytools, // ← Add
];
```

### 5. Restart the server

```bash
npm start
```

Your tool is now available to the MCP server! 🎉

---

## 📚 Transport Modes

### HTTP Mode

The server starts an Express server for HTTP communication.

- Accessible via `POST /mcp`
- Ideal for cloud integrations
- Multi-session support

### Stdio Mode

Communication via stdin/stdout (standard streams).

- Used by default for local clients
- Low latency
- Ideal for scripts

---

## 🔗 Integration with Claude

To use this MCP server with Claude:

1. Configure the server in Claude Desktop settings
2. Add the server URL or execution command
3. Claude will have access to all exposed tools

---

## 📦 Available Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm start`            | Compile and start the server     |
| `npm run build`        | Compile TypeScript to JavaScript |
| `npm run start:server` | Run compiled server              |

---

## 🎨 Code Quality & Formatting

### ESLint

This project uses **ESLint** for code linting and enforcing code standards.

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

ESLint configuration is defined in `eslint.config.ts`. It enforces:
- TypeScript best practices
- Code style consistency
- Potential bug detection

### Prettier

This project uses **Prettier** for automatic code formatting.

```bash
# Format all files automatically
npm run format
```

Prettier ensures consistent code style across the entire project. The configuration is automatically applied to:
- TypeScript files (`.ts`, `.tsx`)
- JavaScript files (`.js`, `.jsx`)
- JSON files
- Markdown files

### Pre-commit Formatting

To ensure code is properly formatted before committing:

```bash
# Format and lint before pushing
npm run lint:fix
npm run format
```

---

## 🧪 Example Tool: Parkings

This boilerplate includes an example `getParkings` tool that returns a list of parkings. You can:

- Study it to understand the structure
- Use it as a base for your own tools
- Delete it when ready

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Open an issue to report a bug
- Propose improvements
- Share extensions

---

## 📄 License

MIT - Free for personal and commercial projects.

---

## 🔗 Resources

- [MCP Official Website](https://modelcontextprotocol.io)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude API](https://Claude.ai)

---

**Ready to get started? Fork this repo and create your first MCP server! 🚀**
