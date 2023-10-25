import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { IOrder } from "../shared/interfaces/entities/order-entity.interface";
import { IOrderItem } from "../shared/interfaces/entities/order-item-entity.interface";
import { IProduct } from "../shared/interfaces/entities/product-entity.interface";

export class OrderItem implements IOrderItem {
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

  updateOrderPrice(newOrderPrice: number): void {
    if (newOrderPrice < this.originalPrice * 0.9) {
      throw new DomainRuleException("New order price is too low");
    }

    this.orderPrice = newOrderPrice;
  }
}
