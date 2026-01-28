import { Elixir } from "@/types/elixir"

export interface Wizard {
  elixirs: Elixir[],
  id: string,
  firstName: string,
  lastName: string
}