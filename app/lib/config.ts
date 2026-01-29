/*
  Project constants
*/

// API
export const API_URL : string = process.env.NEXT_PUBLIC_WIZARD_WORLD_API_URL!
export const STALE_TIME : number = Number(process.env.NEXT_PUBLIC_REQUEST_STALE_TIME) || 1000 * 60 * 5

// Amplitude
export const AMPLITUDE_API_KEY: string = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!
export const AMPLITUDE_SESSION_REPLAY_SAMPLE_RATE: number = Number(process.env.NEXT_PUBLIC_AMPLITUDE_SESSION_REPLAY_SAMPLE_RATE) || 0
