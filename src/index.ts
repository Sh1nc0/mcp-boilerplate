import { createMcpServer, startServer } from "@/server";
import { logger } from "./utils/logger";
import { config } from "./config";

async function main() {
    startServer();
}

main().catch((error) => {
    logger.error("Fatal error in main():", error);
    process.exit(1);
});