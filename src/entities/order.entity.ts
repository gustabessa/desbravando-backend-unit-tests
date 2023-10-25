import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { ICustomer } from "../shared/interfaces/entities/customer-entity.interface";
import { IOrder } from "../shared/interfaces/entities/order-entity.interface";
import { IOrderItem } from "../shared/interfaces/entities/order-item-entity.interface";

export class Order implements IOrder {
  id: number;
  orderCode: string;
  totalPrice: number;
  discount: number;
  discountReason: string;
  status: EOrderStatus;
  type: EOrderType;
  createdAt: Date;
  updatedAt: Date;
  customerId: number;

  customer: ICustomer;
  items: IOrderItem[] = [];

  applyDiscount(dto: IApplyOrderDiscountDto): void {
    const someItemIsPromotional = this.items.some((item) => item.isPromotional);
    if (someItemIsPromotional) {
      throw new DomainRuleException(
        "Can't apply discount to promotional order"
      );
    }

    if (this.type === EOrderType.ONLINE) {
      throw new DomainRuleException("Can't apply discount to online order");
    }

    if (this.status === EOrderStatus.PAID) {
      throw new DomainRuleException("Can't apply discount to paid order");
    }

    const discountDifference = dto.discount - this.discount;
    this.discount = dto.discount;
    this.discountReason = dto.discountReason;
    this.totalPrice -= discountDifference;
  }
}
