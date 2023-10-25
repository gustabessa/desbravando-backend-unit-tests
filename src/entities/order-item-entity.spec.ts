import { OrderItem } from "../../src/entities/order-item.entity";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";

describe("OrderItemEntity", () => {
  describe("[updateOrderPrice]", () => {
    it("should not set new orderItem price if new price is lower than 90% of the original price", () => {
      const orderItemEntity = new OrderItem();
      Reflect.set(orderItemEntity, "originalPrice", 10);

      expect(() => {
        orderItemEntity.updateOrderPrice(8.9);
      }).toThrow(DomainRuleException);
    });

    it("should update orderItem price if new price is not lower than 90% of the original price", () => {
      const orderItemEntity = new OrderItem();
      Reflect.set(orderItemEntity, "originalPrice", 10);

      orderItemEntity.updateOrderPrice(15);
      expect(orderItemEntity.orderPrice).toBe(15);
    });
  });
});
