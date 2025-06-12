import { IOrder } from "../interfaces/entities/order-entity.interface";
import { IOrderRepository } from "../interfaces/repositories/order-repository.interface";

export class OrderRepositoryMock implements IOrderRepository {
  findById = jest.fn();
  save = jest.fn();
}
