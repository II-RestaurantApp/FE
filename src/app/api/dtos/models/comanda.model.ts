import { StatusComada } from "../enums/statusComanda.enum"
import { ItemDto } from "./item.model"
import { UserDto } from "./user.model"

export interface ComandaDto {
  comId: number,
  total: number,
  userId: number,
  user: UserDto,
  item: Array<ItemDto>,
  status: StatusComada,
}