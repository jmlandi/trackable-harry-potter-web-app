"use client"

import { useQuery } from "@tanstack/react-query"
import { API_URL, STALE_TIME } from "@/lib/config"
import { apiFetch } from "@/lib/api"

export default function useHouse(houseId : string) {
  return useQuery({
    queryKey: [`house-${houseId}`],
    queryFn: () => apiFetch(`${API_URL}/houses/${houseId}`),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false
  })
}