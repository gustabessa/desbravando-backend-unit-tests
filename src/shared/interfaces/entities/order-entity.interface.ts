import { EOrderStatus } from "../../enums/order-status.enum";
import { EOrderType } from "../../enums/order-type.enum";
import { IApplyOrderDiscountDto } from "../dto/apply-order-discount-dto.interface";
import { ICustomer } from "./customer-entity.interface";
import { IOrderItem } from "./order-item-entity.interface";

export interface IOrder {
  id: number;
  totalPrice: number;
  discount: number;
  discountReason: string;
  status: EOrderStatus;
  type: EOrderType;
  createdAt: Date;
  updatedAt: Date;
  customerId: number;

  customer: ICustomer;
  items: IOrderItem[];

  applyDiscount(dto: IApplyOrderDiscountDto): void;
}
