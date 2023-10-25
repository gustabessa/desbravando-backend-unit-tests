import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { IOrder } from "../shared/interfaces/entities/order-entity.interface";
import { IOrderItem } from "../shared/interfaces/entities/order-item-entity.interface";
import { Order } from "./order.entity";

describe("OrderEntity", () => {
  describe("[applyDiscount]", () => {
    it("should not apply discount at a promotional item", () => {
      const orderEntity = new Order();

      const orderItens: IOrderItem[] = [
        { id: 1, isPromotional: true },
        { id: 2, isPromotional: false },
        { id: 3, isPromotional: false },
      ] as IOrderItem[];

      Reflect.set(orderEntity, "items", orderItens);

      expect(() => {
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "Sou pobre",
        });
      }).toThrow();
    });

    it("should not apply discount at a online order", () => {
      const orderEntity = new Order();

      Reflect.set(orderEntity, "type", EOrderType.ONLINE);

      expect(() =>
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "Sou júnior",
        })
      ).toThrow();
    });

    it("should not apply discount at a paid order", () => {
      const orderEntity = new Order();

      Reflect.set(orderEntity, "status", EOrderStatus.PAID);

      expect(() =>
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "É dia 25",
        })
      ).toThrow();
    });
  });
});
