import type { Tool } from "@/types/tool";
import { z } from "zod";

const outputSchema = z.object({
    parkings: z.array(
        z.object({
            name: z.string(),
            available: z.number(),
        })
    ),
})

export const getParkings: Tool = {
    name: "getParkings",
    description: "Get a list of parkings in a city",
    outputSchema: outputSchema.shape,
    handler: async (_args: Record<string, unknown>) => {
        return {
            parkings: [],
            content: [
                { type: "text", text: "Not implemented" }
            ]
        };
    }
}