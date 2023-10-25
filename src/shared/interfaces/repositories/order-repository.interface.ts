import { IOrder } from "../entities/order-entity.interface";

export interface IOrderRepository {
  findById(id: number): Promise<IOrder | null>;

  save(order: IOrder): Promise<void>;
}
