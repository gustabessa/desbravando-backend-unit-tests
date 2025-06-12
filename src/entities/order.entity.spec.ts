import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { OrderItem } from "./order-item.entity";
import { Order } from "./order.entity";

const dto = {
  discount: 20,
  discountReason: "Special promotion",
};

const correctTests = [
  { discount: 20, expected: 80 },
  { discount: 30, expected: 70 },
  { discount: 50, expected: 50 },
  { discount: 0, expected: 100 },
  { discount: 10, expected: 90 },
  { discount: 5, expected: 95 },
  { discount: 15, expected: 85 },
  { discount: 25, expected: 75 },
  { discount: 35, expected: 65 },
  { discount: 40, expected: 60 },
  { discount: 45, expected: 55 },
  { discount: 55, expected: 45 },
  { discount: 60, expected: 40 },
  { discount: 70, expected: 30 },
  { discount: 80, expected: 20 },
  { discount: 90, expected: 10 },
  { discount: 100, expected: 0 },
];

describe("OrderEntity", () => {
  it("should throw error if discount is applied to promotional order", () => {
    const order = new Order();
    const orderItem = new OrderItem();
    orderItem.isPromotional = true;
    order.items = [orderItem];

    expect(() => {
      order.applyDiscount(dto);
    }).toThrow(
      new DomainRuleException("Can't apply discount to promotional order")
    );
  });

  it("should throw error if discount is applied to online order", () => {
    const order = new Order();
    order.type = EOrderType.ONLINE;

    expect(() => {
      order.applyDiscount(dto);
    }).toThrow(new DomainRuleException("Can't apply discount to online order"));
  });

  it("should throw error if discount is applied to paid order", () => {
    const order = new Order();
    order.status = EOrderStatus.PAID;

    expect(() => {
      order.applyDiscount(dto);
    }).toThrow(new DomainRuleException("Can't apply discount to paid order"));
  });

  it("should apply discount and set discount reason", () => {
    const order = new Order();
    order.totalPrice = 100;
    order.discount = 0;
    order.discountReason = "";
    order.status = EOrderStatus.CREATED;
    order.type = EOrderType.PHYSICAL;

    order.applyDiscount(dto);

    expect(order.discount).toBe(20);
    expect(order.discountReason).toBe("Special promotion");
  });

  correctTests.forEach(({ discount, expected }) => {
    it(`should apply discount ${discount} and update total price ${expected}`, () => {
      const order = new Order();
      order.totalPrice = 100;
      order.discount = 0;
      order.discountReason = "";
      order.status = EOrderStatus.CREATED;
      order.type = EOrderType.PHYSICAL;

      dto.discount = discount;

      order.applyDiscount(dto);

      expect(order.totalPrice).toBe(expected);
    });
  });
});
