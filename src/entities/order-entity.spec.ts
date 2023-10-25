import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { IOrder } from "../shared/interfaces/entities/order-entity.interface";
import { IOrderItem } from "../shared/interfaces/entities/order-item-entity.interface";
import { orderItens } from "../shared/mocks/orderItemMock";
import { Order } from "./order.entity";

describe("OrderEntity", () => {
  const orderEntity = new Order();
  Reflect.set(orderEntity, "items", orderItens);

  describe("[applyDiscount]", () => {
    it("should not apply discount at a promotional item", () => {
      expect(() => {
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "Sou pobre",
        });
      }).toThrow();
    });

    it("should not apply discount at a online order", () => {
      expect(() =>
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "Sou júnior",
        })
      ).toThrow();
    });

    it("should not apply discount at a paid order", () => {
      expect(() =>
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "É dia 25",
        })
      ).toThrow();
    });
  });
});
