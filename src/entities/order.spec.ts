import { Order } from "./order.entity";

describe("OrderEntity", () => {
  describe("[applyDiscont]", () => {
    it("should apply discount if order is paid, online and with promocional items", () => {
      const orderEntity = new Order();
      Reflect.set(orderEntity, "isPaid", true);
      Reflect.set(orderEntity, "totalPrice", 100);
      Reflect.set(orderEntity, "items", [
        {
          isPromotional: false,
        },
      ]);
      Reflect.set(orderEntity, "type", "PHYSICAL");

      orderEntity.applyDiscount({
        discount: 10,
        discountReason: "Test discount",
      });

      expect(orderEntity.discount).toBe(10);
    });

    it("should throw DomainRuleException when trying to apply discount if order is not paid", () => {
      const orderEntity = new Order();
      Reflect.set(orderEntity, "isPaid", false);
      Reflect.set(orderEntity, "totalPrice", 100);
      Reflect.set(orderEntity, "items", [
        {
          isPromotional: true,
        },
      ]);
      Reflect.set(orderEntity, "type", "PHYSICAL");

      expect(() =>
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "Test discount",
        })
      ).toThrow();
    });

    it("should throw DomainRuleException when trying to apply discount if order is online", () => {
      const orderEntity = new Order();
      Reflect.set(orderEntity, "isPaid", false);
      Reflect.set(orderEntity, "totalPrice", 100);
      Reflect.set(orderEntity, "items", [
        {
          isPromotional: false,
        },
      ]);
      Reflect.set(orderEntity, "type", "ONLINE");

      expect(() =>
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "Test discount",
        })
      ).toThrow();
    });
  });

  it("should throw DomainRuleException when trying to apply discount if order has no promotional items", () => {
    const orderEntity = new Order();
    Reflect.set(orderEntity, "isPaid", false);
    Reflect.set(orderEntity, "totalPrice", 100);
    Reflect.set(orderEntity, "items", []);
    Reflect.set(orderEntity, "type", "PHYSICAL");

    expect(() =>
      orderEntity.applyDiscount({
        discount: 10,
        discountReason: "Test discount",
      })
    ).toThrow();
  });
});
