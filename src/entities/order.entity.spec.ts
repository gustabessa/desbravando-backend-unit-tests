import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { Order } from "./order.entity";

describe("OrderEntity", () => {
  describe("[applyDiscount]", () => {
    it("should not apply discount if some item is promotional", () => {
      const orderEntity = new Order();
      Reflect.set(orderEntity, "items", [
        { id: 1, isPromotional: false },
        { id: 2, isPromotional: true }
      ]);

      expect(() => {
        orderEntity.applyDiscount(orderEntity);
      }).toThrow(
        new DomainRuleException("Can't apply discount to promotional order")
      );
    });

    it("should not apply discount if order is online", () => {
      const orderEntity = new Order();
      Reflect.set(orderEntity, "type", EOrderType.ONLINE);

      expect(() => {
        orderEntity.applyDiscount(orderEntity);
      }).toThrow(
        new DomainRuleException("Can't apply discount to online order")
      );
    });

    it("should not apply discount if order is already paid", () => {
      const orderEntity = new Order();
      Reflect.set(orderEntity, "status", EOrderStatus.PAID);

      expect(() => {
        orderEntity.applyDiscount(orderEntity);
      }).toThrow(new DomainRuleException("Can't apply discount to paid order"));
    });
  });
});
