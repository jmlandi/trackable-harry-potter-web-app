/*
  API library
*/

export async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Error to fetch API, URL: " + url)
  return res.json()
}