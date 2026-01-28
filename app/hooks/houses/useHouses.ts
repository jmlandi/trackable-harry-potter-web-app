"use client"

import { useQuery } from "@tanstack/react-query"
import { API_URL, STALE_TIME } from "@/lib/config"
import { apiFetch } from "@/lib/api"

export default function useHouses() {
  return useQuery({
    queryKey: ["houses"],
    queryFn: () => apiFetch(`${API_URL}/houses`),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false
  })
}

