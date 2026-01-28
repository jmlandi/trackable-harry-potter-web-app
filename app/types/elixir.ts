import { Wizard } from "@/types/wizard"
import { Ingredient } from "@/types/ingredient"

export interface Elixir {
  id: string,
  name: string,
  effect: string,
  sideEffects: string,
  characteristics: string,
  time: string,
  difficulty: string,
  ingredients: Ingredient[],
  inventors: Wizard[],
  manufacturer: string
}