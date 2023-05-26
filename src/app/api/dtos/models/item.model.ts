import { IngredienteDto } from "./ingrediente.model";

export interface ItemDto {
  id?: number,
  denumire: string,
  gramaj: number,
  pret: number,
  ingrediente?: Array<IngredienteDto> | Array<any>,
}