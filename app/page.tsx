"use client"

import useHouses from "@/hooks/houses/useHouses"
export default function Home() {
  const { data, isLoading, error } = useHouses()

  if (error) return `${error.message}`

  if (isLoading) return "<p>Loading...</p>"

  if (data) console.log(data)

  return (
   <>
    <h1>Harry Potter | Website </h1>
   </>
  );
}
