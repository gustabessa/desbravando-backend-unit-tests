import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { IOrderItem } from "../shared/interfaces/entities/order-item-entity.interface";
import { Order } from "./order.entity";

describe("OrderEntity", () => {
  describe("[applyDiscount]", () => {
    it("should be not apply discount if orderItens has status paid", () => {
      const orderEntity = new Order();
      Reflect.set(orderEntity, "status", EOrderStatus.PAID);

      expect(() => {
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "Sim",
        });
      }).toThrowError("Can't apply discount to paid order");
    });

    it("should be not apply discount if orderItens has type is online", () => {
      const orderEntity = new Order();
      Reflect.set(orderEntity, "type", EOrderType.ONLINE);

      expect(() => {
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "Sim",
        });
      }).toThrowError("Can't apply discount to online order");
    });

    it("should be not apply discount if order itens has any item promotional", () => {
      const orderItems = [
        {
          id: 1,
          isPromotional: true,
        },
        {
          id: 2,
          isPromotional: false,
        },
      ] as IOrderItem[];

      const orderEntity = new Order();

      Reflect.set(orderEntity, "items", orderItems);

      expect(() => {
        orderEntity.applyDiscount({
          discount: 10,
          discountReason: "Sim",
        });
      }).toThrowError("Can't apply discount to promotional order");
    });
  });
});
