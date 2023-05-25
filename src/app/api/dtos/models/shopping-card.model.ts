import { ItemDto } from "./item.model";

export interface ShoppingCartItem {
  product: ItemDto,
  quantity: number
}