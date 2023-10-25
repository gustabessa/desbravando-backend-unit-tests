import { IOrderItem } from "../entities/order-item-entity.interface";

export interface IOrderItemRepository {
  findById(id: number): Promise<IOrderItem | null>;

  save(orderItem: IOrderItem): Promise<void>;
}
