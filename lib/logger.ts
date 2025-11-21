/**
 * Development-only logger utility
 * Logs are only shown in development mode (NODE_ENV === 'development')
 * In production builds, all logs are stripped out
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args)
  },
  
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args)
  },
  
  error: (...args: any[]) => {
    if (isDev) console.error(...args)
  },
  
  info: (...args: any[]) => {
    if (isDev) console.info(...args)
  },
  
  debug: (...args: any[]) => {
    if (isDev) console.debug(...args)
  }
}

// For production errors that should always be logged
export const prodLogger = {
  error: (...args: any[]) => console.error(...args),
  warn: (...args: any[]) => console.warn(...args)
}
