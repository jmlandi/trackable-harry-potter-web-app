/**
 * USEHOUSE HOOK
 * =============
 * Custom React Query hook for fetching a single Hogwarts house by ID.
 *
 * Features:
 * - Automatic caching (5 minute stale time)
 * - Unique cache per house (different query keys per ID)
 * - Loading and error states
 * - Background refetching
 *
 * Note: Currently not used in components, kept for potential
 * detailed house page or admin dashboard.
 */
"use client"

import { useQuery } from "@tanstack/react-query"
import { API_URL, STALE_TIME } from "@/lib/config"
import { apiFetch } from "@/lib/api"
import { House } from "@/types/house"

/**
 * Fetch a single house by ID from Wizard World API
 *
 * @param houseId - ID of the house to fetch (e.g., "1")
 * @returns useQuery result object
 *   - data: House - Single house object
 *   - isLoading: boolean - True while fetching
 *   - error: Error | null - Any fetch error
 *   - isSuccess: boolean - True if data loaded successfully
 *
 * Example usage in component:
 * const { data: house, isLoading } = useHouse("1");
 * if (isLoading) return <div>Loading...</div>;
 * return <HouseDetail house={house} />;
 */
export default function useHouse(houseId: string) {
  return useQuery<House>({
    // Unique key for each house - ensures separate caches
    // Multiple useHouse("1") calls = 1 API request
    // useHouse("1") and useHouse("2") = separate caches
    queryKey: [`house-${houseId}`],

    // Function that fetches data for this specific house
    queryFn: () => apiFetch<House>(`${API_URL}/houses/${houseId}`),

    // Time until cached data is considered stale
    // Default: 5 minutes (300000ms)
    staleTime: STALE_TIME,

    // Don't refetch when window regains focus
    refetchOnWindowFocus: false
  })
}