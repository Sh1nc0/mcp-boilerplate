import { z } from 'zod';

import { config } from '../../config';
import type { ParkingResponse } from '../../types/parking';
import type { Tool } from '../../types/tool';
import { logger } from '../../utils/logger';

const outputSchema = z.object({
    parkings: z.array(
        z.object({
            name: z.string(),
            available: z.number(),
        })
    ),
});

async function fetchParkingData() {
    const { API_BASE_URL } = config;
    logger.info('Fetching parking data from Angers...');
    const response = await fetch(
        `${API_BASE_URL}/api/explore/v2.1/catalog/datasets/parking-angers/records?limit=20`
    );
    const data = (await response.json()) as ParkingResponse;
    const resultsCount = data.results.map((record) => ({
        name: record.nom,
        available: record.disponible,
    }));

    return resultsCount;
}

export const getParkings: Tool = {
    name: 'getParkings',
    description: 'Get a list of parkings in a city',
    outputSchema: outputSchema.shape,
    handler: async () => {
        const parkings = await fetchParkingData();
        const structuredContent = { parkings };
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(structuredContent, null, 2),
                },
            ],
            structuredContent,
        };
    },
};
