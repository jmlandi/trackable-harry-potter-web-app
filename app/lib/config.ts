/**
 * ENVIRONMENT CONFIGURATION
 * ==========================
 * Centralized configuration for environment variables.
 * Single source of truth for all configuration across the app.
 *
 * Benefits:
 * - Type-safe access to environment variables
 * - Easy to update configuration globally
 * - Clear separation of public vs private keys
 */

/** ============================================================
    EXTERNAL API CONFIGURATION
    ============================================================ */

/**
 * Wizard World API - Hogwarts data source
 * @example "https://wizard-world-api.herokuapp.com"
 */
export const API_URL: string = process.env.NEXT_PUBLIC_WIZARD_WORLD_API_URL!

/**
 * Cache duration for API responses (milliseconds)
 * Default: 5 minutes
 * @example 300000 (5 * 60 * 1000)
 *
 * Used by React Query to determine when cached data is stale.
 * If query is older than this, it will be refetched in the background.
 */
export const STALE_TIME: number = Number(process.env.NEXT_PUBLIC_REQUEST_STALE_TIME) || 1000 * 60 * 5

/** ============================================================
    AMPLITUDE ANALYTICS CONFIGURATION
    ============================================================ */

/**
 * Amplitude API Key (publishable key)
 * Safe to expose in frontend code
 * @note Never expose service/secret keys
 * @env NEXT_PUBLIC_AMPLITUDE_API_KEY
 */
export const AMPLITUDE_API_KEY: string = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!

/**
 * Session Replay sample rate (0.0 - 1.0)
 * Default: 0.05 (5% of sessions)
 *
 * Lower values reduce costs, higher values increase data collection.
 * Used by Amplitude to determine which sessions to record.
 * @env NEXT_PUBLIC_AMPLITUDE_SESSION_REPLAY_SAMPLE_RATE
 */
export const AMPLITUDE_SESSION_REPLAY_SAMPLE_RATE: number = Number(process.env.NEXT_PUBLIC_AMPLITUDE_SESSION_REPLAY_SAMPLE_RATE) || 0
