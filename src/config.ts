import { z } from 'zod';

const schema = z.object({
    MCP_SERVER_NAME: z.string().optional().default('mcp-boilerplate'),
    MCP_SERVER_VERSION: z.string().optional().default('1.0.0'),
    MCP_MODE: z.enum(['stdio', 'http']).default('stdio'),
    HOST: z.string().optional().default('127.0.0.1'),
    PORT: z.string().optional().default('8004'),
    LOG_LEVEL: z.enum(['debug', 'info', 'error']).default('info'),
    API_BASE_URL: z.string(),
});

export const config = schema.parse(process.env);
