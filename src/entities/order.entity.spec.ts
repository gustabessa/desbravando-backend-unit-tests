import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { Order } from "./order.entity";

describe("OrderEntity", () => {
  describe("[applyDiscount]", () => {
    it("should throw an error if the order is promotional", () => {
      const order = new Order();
      Reflect.set(order, "items", [{ isPromotional: true }]);

      expect(() => {
        order.applyDiscount({ discount: 10, discountReason: "Test" });
      }).toThrow(DomainRuleException);
    });

    it("should throw an error if the order is online", () => {
      const order = new Order();
      Reflect.set(order, "type", EOrderType.ONLINE);

      expect(() => {
        order.applyDiscount({ discount: 10, discountReason: "Test" });
      }).toThrow(DomainRuleException);
    });

    it("should throw an error if the order is paid", () => {
      const order = new Order();
      Reflect.set(order, "status", EOrderStatus.PAID);

      expect(() => {
        order.applyDiscount({ discount: 10, discountReason: "Test" });
      }).toThrow(DomainRuleException);
    });

    it("should apply discount to the order", () => {
      const objectWithPrices = Object.assign(new Order(), {
        totalPrice: 100,
        discount: 0,
        discountReason: "",
        items: [{ isPromotional: false }],
      });

      const discount = 10;
      const discountReason = "Test";
      const expectedTotalPrice = objectWithPrices.totalPrice - discount;

      objectWithPrices.applyDiscount({ discount, discountReason });
      expect(objectWithPrices.totalPrice).toBe(expectedTotalPrice);
    });

    it("should apply discount on top of discount to the order", () => {
      const objectWithPrices = Object.assign(new Order(), {
        totalPrice: 100,
        discount: 20,
        discountReason: "",
        items: [{ isPromotional: false }],
      });

      const discount = 30;
      const discountReason = "Test";
      const expectedTotalPrice = objectWithPrices.totalPrice - 10;

      objectWithPrices.applyDiscount({ discount, discountReason });
      expect(objectWithPrices.totalPrice).toBe(expectedTotalPrice);
    });
  });
});
