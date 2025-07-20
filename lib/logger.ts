enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  error(message: string, error?: Error | any, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };
    console.error(this.formatMessage(LogLevel.ERROR, message, errorContext));
  }

  // Método para logs de performance
  performance(operation: string, duration: number, context?: LogContext): void {
    const performanceContext = {
      ...context,
      duration: `${duration}ms`,
    };
    this.info(`Performance: ${operation}`, performanceContext);
  }

  // Método para logs de API
  api(method: string, url: string, status?: number, context?: LogContext): void {
    const apiContext = {
      ...context,
      method,
      url,
      status,
    };
    this.info(`API ${method} ${url}`, apiContext);
  }
}

export const logger = new Logger(); 