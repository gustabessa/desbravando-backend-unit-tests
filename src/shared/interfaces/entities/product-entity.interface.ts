import { IOrderItem } from "./order-item-entity.interface";

export interface IProduct {
  id: number;
  name: string;
  price: number;
  isPromotional: boolean;
  createdAt: Date;
  updatedAt: Date;

  orderItems: IOrderItem[];
}
