/*
  Project constants
*/

export const API_URL : string = process.env.NEXT_PUBLIC_WIZARD_WORLD_API_URL!
export const STALE_TIME : number = Number(process.env.NEXT_PUBLIC_REQUEST_STALE_TIME) || 1000 * 60 * 5
