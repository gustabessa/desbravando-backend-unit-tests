import { EOrderStatus } from "../enums/order-status.enum";
import { EOrderType } from "../enums/order-type.enum";
import { ICustomer } from "../interfaces/entities/customer-entity.interface";
import { IOrder } from "../interfaces/entities/order-entity.interface";
import { IOrderItem } from "../interfaces/entities/order-item-entity.interface";

export class OrderMock implements IOrder {
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

  applyDiscount = jest.fn();
}

/* export const orderMock: IOrder = {
    id: 1,
    totalPrice: 100,
    discount: 0,
    discountReason: "",
    status: EOrderStatus.CREATED,
    type: EOrderType.ONLINE,
    createdAt: new Date(),
    updatedAt: new Date(),
    customerId: 1,
    customer: {
        id: "1",
        name: "John Doe",
        email: "",
        orders: [],
    } as ICustomer,
    items: [
        {
            id: 1,
            productId: 1,
            quantity: 1,
            price: 100,
            orderId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            product: {
                id: 1,
                name: "Product 1",
                price: 100,
                description: "Description 1",
                createdAt: new Date(),
                updatedAt: new Date(),
                categoryId: 1,
                category: {
                    id: 1,
                    name: "Category 1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    products: [],
                },
                orders: [],
            },
        } as IOrderItem,
    ],
}; */
