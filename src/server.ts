import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { logger } from "@utils/logger";
import { allTools } from "@tools/index";
import { createServer } from "node:http";
import express from "express";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";
import { config } from "./config";


const sessions = new Map<string, StreamableHTTPServerTransport>();

export function createMcpServer(): McpServer {
    const { MCP_SERVER_NAME, MCP_SERVER_VERSION } = config;

    const server = new McpServer({
        name: MCP_SERVER_NAME,
        version: MCP_SERVER_VERSION,
    });

    for (const tool of allTools) {
        server.registerTool(
            tool.name,
            {
                description: tool.description,
                inputSchema: tool.inputSchema,
                outputSchema: tool.outputSchema,
            },
            tool.handler
        );
    }
    return server;
}

async function startStdioServer() {
    const server = createMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

async function startHttpServer() {
    const { HOST, PORT } = config;

    const app = express();
    app.use(express.json());

    app.post('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined

        let transport: StreamableHTTPServerTransport

        if (sessionId && sessions.has(sessionId)) {
            transport = sessions.get(sessionId)!
        } else if (!sessionId && isInitializeRequest(req.body)) {
            const server = createMcpServer();
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                onsessioninitialized: (id) => {
                    sessions.set(id, transport)
                    logger.debug(`session ouverte : ${id}`)
                },
            })

            transport.onclose = () => {
                const id = transport.sessionId
                if (id) {
                    sessions.delete(id)
                    logger.debug(`session fermée : ${id}`)
                }
            }
            await server.connect(transport)

        } else {
            res.status(400).json({ error: 'session invalide ou requête init manquante' })
            return
        }

        await transport.handleRequest(req, res, req.body)
    })

    app.get('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined
        const transport = sessionId ? sessions.get(sessionId) : undefined

        if (!transport) {
            res.status(400).json({ error: 'session introuvable' })
            return
        }

        await transport.handleRequest(req, res)
    })

    app.delete('/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined
        const transport = sessionId ? sessions.get(sessionId) : undefined

        if (!transport) {
            res.status(400).json({ error: 'session introuvable' })
            return
        }

        await transport.handleRequest(req, res)
    })

    app.listen(parseInt(PORT), HOST, () => {
        logger.info(`http | ${allTools.length} tools | http://${HOST}:${PORT}/mcp`)
    })


}

export function startServer() {
    const { MCP_MODE } = config;

    switch (MCP_MODE) {
        case "stdio":
            startStdioServer().catch((error) => {
                logger.error("Failed to start stdio server:", error);
            });
            break;
        case "http":
            startHttpServer().catch((error) => {
                logger.error("Failed to start HTTP server:", error);
            });
            break;
    }
}