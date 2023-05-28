import { StatusComada } from "../enums/statusComanda.enum";
import { ComandaItem } from "./comanda-item.model";

export interface Order {
  comId: number,
  total: number,
  userId: number,
  items?: Array<ComandaItem>,
  status: StatusComada,
}