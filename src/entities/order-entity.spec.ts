import { Order } from "../../src/entities/order.entity";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { IOrderItem } from "../shared/interfaces/entities/order-item-entity.interface";
import { OrderItem } from "../../src/entities/order-item.entity";

describe("OrderEntity", () => {
  describe("[applyDiscount]", () => {
    it("should not define if the item is promotional", () => {
      const item: IOrderItem[] = [
        {
          id: 1,
          isPromotional: true,
        },
        {
          id: 2,
          isPromotional: true,
        },
        {
          id: 3,
          isPromotional: false,
        },
        {
          id: 4,
          isPromotional: true,
        },
      ] as OrderItem[];

      const dto: IApplyOrderDiscountDto = {
        discount: 10,
        discountReason: "Pq o Bessa pediu pra testar",
      };
      const orderEntity = new Order();
      Reflect.set(orderEntity, "items", item);

      expect(() => {
        orderEntity.applyDiscount(dto);
      }).toThrow(DomainRuleException);
    });

    it("should define if the item is promotional", () => {
      const item: IOrderItem[] = [
        {
          id: 1,
          isPromotional: false,
        },
        {
          id: 2,
          isPromotional: false,
        },
        {
          id: 3,
          isPromotional: false,
        },
        {
          id: 4,
          isPromotional: false,
        },
      ] as OrderItem[];

      const dto: IApplyOrderDiscountDto = {
        discount: 10,
        discountReason: "Pq o Bessa pediu pra testar",
      };
      const orderEntity = new Order();
      Reflect.set(orderEntity, "items", item);

      orderEntity.applyDiscount(dto);
      expect(item.some((item) => item.isPromotional)).toBe(false);
    });
  });
});
