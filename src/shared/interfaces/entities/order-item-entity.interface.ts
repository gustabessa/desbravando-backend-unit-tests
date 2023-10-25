import { IOrder } from "./order-entity.interface";
import { IProduct } from "./product-entity.interface";

export interface IOrderItem {
  id: number;
  name: string;
  quantity: number;
  originalPrice: number;
  orderPrice: number;
  isPromotional: boolean;
  orderId: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;

  order: IOrder;
  product: IProduct;

  updateOrderPrice(orderPrice: number): void;
}
