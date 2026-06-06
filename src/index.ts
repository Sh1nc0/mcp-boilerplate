import { startServer } from './server';
import { logger } from './utils/logger';

async function main() {
    startServer();
}

main().catch((error) => {
    logger.error('Fatal error in main():', error);
    process.exit(1);
});
