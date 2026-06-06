import { config } from '@/config';

const levels = {
    debug: 0,
    info: 1,
    error: 2,
};

function log(level: 'debug' | 'info' | 'error', ...args: unknown[]){
    if(levels[level] < levels[config.LOG_LEVEL]) return;
    process.stderr.write(`[${level.toUpperCase()}] ${args.map(String).join(' ')}\n`);
}

export const logger = {
    debug: (...args: unknown[]) => log('debug', ...args),
    info: (...args: unknown[]) => log('info', ...args),
    error: (...args: unknown[]) => log('error', ...args),
};