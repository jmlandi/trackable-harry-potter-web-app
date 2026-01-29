"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"

import useHouses from "@/hooks/houses/useHouses"
import { House } from "@/types/house"
import { trackEvent } from "@/lib/analytics"

function HouseField({
  label,
  value,
}: {
  label: string
  value?: string
}) {
  if (!value) return null

  return (
    <p className="text-sm text-gray-300">
      {label}:
      <span className="text-gray-50 font-extrabold"> {value}</span>
    </p>
  )
}

export default function Houses() {
  const { data, isLoading } = useHouses()
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null)

  function openHouseDetails(house: House) {
    trackEvent()
    setSelectedHouse(house)
  }

  function closeHouseDetails() {
    trackEvent()
    setSelectedHouse(null)
  }

  if (isLoading) return <h3>Loading houses...</h3>

  if (!data || data.length === 0) {
    return <h3>No houses found! Please try again later</h3>
  }

  return (
    <>
      <section className="my-3.5 p-3.5 flex flex-col items-center gap-3.5 w-screen">
        <h3 className="text-6xl text-center font-extralight lowercase italic">
          Know our <span className="font-extrabold">Houses</span>
        </h3>

        <ul className="w-full flex flex-wrap justify-center sm:justify-between gap-3.5 border-2 border-gray-900 p-3.5 rounded-2xl">
          {data.map((house) => (
            <li
              key={house.id}
              className="flex flex-col gap-2 p-3.5 rounded-2xl max-w-150 min-w-full sm:min-w-80 bg-gray-900"
            >
              <h4 className="text-2xl font-bold text-gray-50 italic border-b border-gray-600 pb-3 mb-3">
                {house.name}
              </h4>

              <HouseField label="Animal" value={house.animal} />
              <HouseField label="Element" value={house.element} />
              <HouseField label="Common Room" value={house.commonRoom} />

              <button
                onClick={() => openHouseDetails(house)}
                className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-gray-300 text-gray-900 font-extrabold hover:bg-gray-950 hover:text-gray-300 transition-all cursor-pointer"
              >
                <Info size={18} />
                Details
              </button>

              <p className="text-xs text-gray-600 mt-3">ID: {house.id}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* MODAL */}
      {selectedHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm m-3.5">
          <div className="relative w-full max-w-lg rounded-2xl bg-gray-900 p-6 text-gray-50">
            <button
              onClick={closeHouseDetails}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-50 cursor-pointer"
            >
              <X />
            </button>

            <h3 className="text-3xl font-bold italic mb-4">
              {selectedHouse.name}
            </h3>

            <div className="flex flex-col gap-2 text-sm">
              <HouseField label="Animal" value={selectedHouse.animal} />
              <HouseField label="Element" value={selectedHouse.element} />
              <HouseField label="Common Room" value={selectedHouse.commonRoom} />
              <HouseField label="Founder" value={selectedHouse.founder} />
              <HouseField label="Ghost" value={selectedHouse.ghost} />
              <HouseField label="Heads" value={selectedHouse.heads.map(head =>  { return `${head.firstName} ${head.lastName}` }).join(", ")} />
              <HouseField label="Traits" value={selectedHouse.traits.map(trait => { return trait.name }).join(", ")} />
            </div>

            <p className="text-xs text-gray-500 mt-6">
              ID: {selectedHouse.id}
            </p>
          </div>
        </div>
      )}
    </>
  )
}


