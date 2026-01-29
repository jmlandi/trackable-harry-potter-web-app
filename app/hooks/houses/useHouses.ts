/**
 * USEHOUSES HOOK
 * ==============
 * Custom React Query hook for fetching all Hogwarts houses.
 *
 * Features:
 * - Automatic caching (5 minute stale time)
 * - Deduplication (multiple components requesting same data = 1 API call)
 * - Background refetching when data becomes stale
 * - Loading and error states
 * - Configurable via react-query
 */
"use client"

import { useQuery } from "@tanstack/react-query"
import { API_URL, STALE_TIME } from "@/lib/config"
import { apiFetch } from "@/lib/api"
import { House } from "@/types/house"

/**
 * Fetch all Hogwarts houses from Wizard World API
 *
 * @returns useQuery result object
 *   - data: House[] - Array of all houses
 *   - isLoading: boolean - True while fetching
 *   - error: Error | null - Any fetch error
 *   - isSuccess: boolean - True if data loaded successfully
 *
 * Example usage in component:
 * const { data: houses, isLoading } = useHouses();
 * if (isLoading) return <div>Loading...</div>;
 * return houses.map(house => <HouseCard key={house.id} house={house} />);
 */
export default function useHouses() {
  return useQuery<House[]>({
    // Unique key for this query - used for caching and deduplication
    queryKey: ["houses"],

    // Function that fetches the data
    queryFn: () => apiFetch<House[]>(`${API_URL}/houses`),

    // Time until cached data is considered "stale" and needs refetch
    // Default: 5 minutes (300000ms)
    staleTime: STALE_TIME,

    // Don't refetch when window regains focus
    refetchOnWindowFocus: false
  })
}

