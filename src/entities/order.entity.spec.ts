import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { OrderItem } from "./order-item.entity";
import { Order } from "./order.entity";

describe("Order Entity", () => {
  const createOrderItem = ({ isPromotional }: { isPromotional: boolean }) => {
    const orderItemEntity = new OrderItem();
    return Object.assign(orderItemEntity, {
      id: 1,
      name: "Product 1",
      quantity: 1,
      originalPrice: 100,
      orderPrice: 100,
      isPromotional,
      orderId: 1,
      productId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const createOrder = ({
    status,
    type,
    items,
    totalPrice = 100,
    discount = 0,
    discountReason = "",
  }: {
    status: EOrderStatus;
    type: EOrderType;
    items: OrderItem[];
    totalPrice?: number;
    discount?: number;
    discountReason?: string;
  }) => {
    const orderEntity = new Order();
    return Object.assign(orderEntity, {
      id: 1,
      orderCode: "123456",
      totalPrice: totalPrice,
      discount,
      discountReason,
      status,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerId: 1,
      customer: {
        id: 1,
        name: "John Doe",
        email: "teste@teste.com",
      },
      items,
    });
  };

  const promotionalItem = createOrderItem({ isPromotional: true });
  const notPromotionalItem = createOrderItem({ isPromotional: false });
  const discountDTO = {
    discount: 10,
    discountReason: "cliente gente boa!",
  };

  it("should not apply discount to the order because has promotional item,", () => {
    const order = createOrder({
      status: EOrderStatus.CREATED,
      type: EOrderType.PHYSICAL,
      items: [promotionalItem],
    });

    expect(() => order.applyDiscount(discountDTO)).toThrow(
      new DomainRuleException("Can't apply discount to promotional order")
    );
  });

  it("should not apply discount to the order because is online,", () => {
    const order = createOrder({
      status: EOrderStatus.CREATED,
      type: EOrderType.ONLINE,
      items: [notPromotionalItem],
    });

    expect(() => order.applyDiscount(discountDTO)).toThrow(
      new DomainRuleException("Can't apply discount to online order")
    );
  });

  it("should not apply discount to the order because is paid,", () => {
    const order = createOrder({
      status: EOrderStatus.PAID,
      type: EOrderType.PHYSICAL,
      items: [notPromotionalItem],
    });

    expect(() => order.applyDiscount(discountDTO)).toThrow(
      new DomainRuleException("Can't apply discount to paid order")
    );
  });

  it("should apply discount to the order,", () => {
    const order = createOrder({
      status: EOrderStatus.CREATED,
      type: EOrderType.PHYSICAL,
      items: [notPromotionalItem],
      totalPrice: 100,
    });

    order.applyDiscount(discountDTO);

    expect(order.discount).toBe(10);
    expect(order.discountReason).toBe("cliente gente boa!");
    expect(order.totalPrice).toBe(90);
  });

  it("should apply discount to the order that already have discount", () => {
    const order = createOrder({
      status: EOrderStatus.CREATED,
      type: EOrderType.PHYSICAL,
      items: [notPromotionalItem],
      discount: 5,
      discountReason: "vizinho da dona maria",
      totalPrice: 100,
    });

    order.applyDiscount(discountDTO);

    expect(order.discount).toBe(10);
    expect(order.discountReason).toBe("cliente gente boa!");
    expect(order.totalPrice).toBe(95);
  });
});
