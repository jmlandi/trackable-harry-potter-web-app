"use client"

import { useQuery } from "@tanstack/react-query"
import { API_URL, STALE_TIME } from "@/lib/config"
import { apiFetch } from "@/lib/api"
import { House } from "@/types/house"

export default function useHouse(houseId : string) {
  return useQuery<House>({
    queryKey: [`house-${houseId}`],
    queryFn: () => apiFetch<House>(`${API_URL}/houses/${houseId}`),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false
  })
}