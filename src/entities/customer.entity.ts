import { ICustomer } from "../shared/interfaces/entities/customer-entity.interface";
import { IOrder } from "../shared/interfaces/entities/order-entity.interface";

export class Customer implements ICustomer {
  id: string;
  name: string;
  email: string;

  orders: IOrder[];
}
