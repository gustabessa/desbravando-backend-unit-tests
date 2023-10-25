import { OrderItem } from "./order-item.entity";

describe("OrderItemEntity", () => {
  describe("[updateOrderPrice]", () => {
    it("should not set new orderItem price if it is lower than 90% of the original price", () => {
      const orderItemEntity = new OrderItem();
      Reflect.set(orderItemEntity, "originalPrice", 10);

      expect(()=> orderItemEntity.updateOrderPrice(8.9)).toThrowError();
    });

    it("should set new orderItem price if it is greater than 90% of the original price", () => {
      const orderItemEntity = new OrderItem();
      Reflect.set(orderItemEntity, "originalPrice", 10);

      orderItemEntity.updateOrderPrice(15);

      expect(orderItemEntity.orderPrice).toBe(15);
    });
  });
});
