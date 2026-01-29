/**
 * API UTILITIES
 * =============
 * Helper functions for making HTTP requests to external APIs.
 * Currently used for Wizard World API (Hogwarts houses data).
 */

/**
 * Generic fetch wrapper with error handling
 *
 * @template T - Return type (inferred from usage)
 * @param url - Full URL to fetch from
 * @returns Parsed JSON response of type T
 * @throws Error if response is not ok (status >= 400)
 *
 * Examples:
 * - const houses = await apiFetch<House[]>(`${API_URL}/houses`)
 * - const house = await apiFetch<House>(`${API_URL}/houses/1`)
 */
export async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)

  // Handle HTTP errors (4xx, 5xx responses)
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}. URL: ${url}`)
  }

  return res.json()
}