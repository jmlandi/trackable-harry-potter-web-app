"use client"

import { useQuery } from "@tanstack/react-query"
import { API_URL, STALE_TIME } from "@/lib/config"
import { apiFetch } from "@/lib/api"
import { House } from "@/types/house"

export default function useHouses() {
  return useQuery<House[]>({
    queryKey: ["houses"],
    queryFn: () => apiFetch<House[]>(`${API_URL}/houses`),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false
  })
}

