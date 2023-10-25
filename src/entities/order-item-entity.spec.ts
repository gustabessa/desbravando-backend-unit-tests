import { OrderItem } from "../../src/entities/order-item.entity";

describe("OrderItemEntity", () => {
  describe("[updateOrderPrice]", () => {
    it("should not set new orderItem price if it is lower than 90% of the original price", () => {
      const orderItemEntity = new OrderItem();
      Reflect.set(orderItemEntity, "originalPrice", 10);

      console.log({ orderItemEntity });
    });
  });
});
