import { IOrder } from "./order-entity.interface";

export interface ICustomer {
  id: string;
  name: string;
  email: string;

  orders: IOrder[];
}
