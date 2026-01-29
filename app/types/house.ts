import { Wizard } from "@/types/wizard"
import { Trait } from "@/types/trait"

export interface House {
  id: string,
  name: string,
  animal: string,
  commonRoom: string,
  element: string,
  founder: string,
  ghost: string,
  heads: Wizard[],
  traits: Trait[]
}