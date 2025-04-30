import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { IOrderItem } from "../shared/interfaces/entities/order-item-entity.interface";
import { IProduct } from "../shared/interfaces/entities/product-entity.interface";
import { Order } from "./order.entity";

describe("orderEntity", () => {
  interface setupProps {
    orderType?: EOrderType;
    orderStatus?: EOrderStatus;
    itemIsPromotional?: boolean;
  }

  const setup = (dto: setupProps) => {
    const order = new Order();

    order.id = 1;
    order.orderCode = "ORD123";
    order.totalPrice = 100;
    order.discount = 0;
    order.discountReason = "";
    order.status = dto.orderStatus ?? EOrderStatus.CREATED;
    order.type = dto.orderType ?? EOrderType.PHYSICAL;
    order.createdAt = new Date();
    order.updatedAt = new Date();
    order.customerId = 1;
    order.items = [
      {
        id: 1,
        name: "Item 1",
        quantity: 1,
        originalPrice: 50,
        orderPrice: 50,
        isPromotional: dto.itemIsPromotional ?? false,
        orderId: 1,
        productId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),

        order: order,
        product: {} as IProduct,

        updateOrderPrice() {},
      },
    ];

    return {
      order,
    };
  };

  describe("[applyDiscount]", () => {
    it("should apply discount to order", () => {
      const { order } = setup({});

      order.applyDiscount({
        discount: 10,
        discountReason: "Test",
      });

      expect(order.discount).toBe(10);
      expect(order.discountReason).toBe("Test");
      expect(order.totalPrice).toBe(90);
    });

    it("should throw error when order is promotional", () => {
      const { order } = setup({ itemIsPromotional: true });

      expect(() => {
        order.applyDiscount({
          discount: 10,
          discountReason: "Test",
        });
      }).toThrowError("Can't apply discount to promotional order");
    });

    it("should throw error when order is online", () => {
      const { order } = setup({ orderType: EOrderType.ONLINE });

      expect(() => {
        order.applyDiscount({
          discount: 10,
          discountReason: "Test",
        });
      }).toThrowError("Can't apply discount to online order");
    });

    it("should throw error when order is paid", () => {
      const { order } = setup({ orderStatus: EOrderStatus.PAID });

      expect(() => {
        order.applyDiscount({
          discount: 10,
          discountReason: "Test",
        });
      }).toThrowError("Can't apply discount to paid order");
    });
  });
});
