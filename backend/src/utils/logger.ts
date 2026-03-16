type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const colors = {
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  debug: '\x1b[35m',
  reset: '\x1b[0m',
};

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const color = colors[level];
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${color}[${timestamp}] [${level.toUpperCase()}]${colors.reset} ${message}${metaStr}`;
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>): void => {
    console.log(formatMessage('info', message, meta));
  },
  warn: (message: string, meta?: Record<string, unknown>): void => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message: string, meta?: Record<string, unknown>): void => {
    console.error(formatMessage('error', message, meta));
  },
  debug: (message: string, meta?: Record<string, unknown>): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatMessage('debug', message, meta));
    }
  },
};
