import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import type { ZodRawShape } from 'zod';

export interface Tool {
    name: string;
    description: string;
    inputSchema?: ZodRawShape;
    outputSchema?: ZodRawShape;
    handler: (args: Record<string, unknown>) => Promise<CallToolResult>;
}
