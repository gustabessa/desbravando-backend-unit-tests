import { IOrderItemRepository } from "../interfaces/repositories/order-item.repository.interface";

export class OrderItemRepositoryMock implements IOrderItemRepository {
  findById = jest.fn();
  save = jest.fn();
}
