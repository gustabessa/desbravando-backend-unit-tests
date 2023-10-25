import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { IOrderItem } from "../shared/interfaces/entities/order-item-entity.interface";
import { Order } from "./order.entity";

describe("OrderEntity", () => {
  describe("[applyDiscount]", () => {
    it("should not be able to apply discount if some item is promotional", () => {
      const orderItems: IOrderItem[] = [
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
          isPromotional: true,
        },
      ] as IOrderItem[];
      const orderEntity = new Order();
      Reflect.set(orderEntity, "items", orderItems);

      expect(() => {
        orderEntity.applyDiscount({
          discount: 1,
          discountReason: "Carteirada do Neymar",
        });
      }).toThrow(DomainRuleException);
    });
    it("should not be able to apply discount if order is type online", () => {
      const orderItems: IOrderItem[] = [
        {
          id: 1,
          isPromotional: false,
        } as unknown as IOrderItem,
        {
          id: 2,
          isPromotional: false,
        } as unknown as IOrderItem,
        {
          id: 3,
          isPromotional: false,
        } as unknown as IOrderItem,
      ];
      const orderEntity = new Order();
      Reflect.set(orderEntity, "items", orderItems);
      Reflect.set(orderEntity, "type", EOrderType.ONLINE);

      expect(() => {
        orderEntity.applyDiscount({
          discount: 1,
          discountReason: "Carteirada do Neymar",
        });
      }).toThrow(DomainRuleException);
    });
    it("should not be able to apply discount if order is status paid", () => {
      const orderItems: IOrderItem[] = [
        {
          id: 1,
          isPromotional: false,
        } as unknown as IOrderItem,
        {
          id: 2,
          isPromotional: false,
        } as unknown as IOrderItem,
        {
          id: 3,
          isPromotional: false,
        } as unknown as IOrderItem,
      ];
      const orderEntity = new Order();
      Reflect.set(orderEntity, "items", orderItems);
      Reflect.set(orderEntity, "status", EOrderStatus.PAID);

      expect(() => {
        orderEntity.applyDiscount({
          discount: 1,
          discountReason: "Carteirada do Neymar",
        });
      }).toThrow(DomainRuleException);
    });
    it("should apply discount correctly if all conditions are matched", () => {
      const testCases = [
        { initialDiscount: 0, newDiscount: 10, expectedResult: 10 },
        { initialDiscount: 20, newDiscount: 10, expectedResult: 30 },
        { initialDiscount: 20, newDiscount: 0, expectedResult: 40 },
      ];
      const orderItems: IOrderItem[] = [
        {
          id: 1,
          isPromotional: false,
        } as unknown as IOrderItem,
        {
          id: 2,
          isPromotional: false,
        } as unknown as IOrderItem,
        {
          id: 3,
          isPromotional: false,
        } as unknown as IOrderItem,
      ];

      testCases.forEach(({ initialDiscount, newDiscount, expectedResult }) => {
        const orderEntity = new Order();
        Reflect.set(orderEntity, "items", orderItems);
        Reflect.set(orderEntity, "status", EOrderStatus.CREATED);
        Reflect.set(orderEntity, "totalPrice", 20);
        Reflect.set(orderEntity, "discount", initialDiscount);

        orderEntity.applyDiscount({
          discount: newDiscount,
          discountReason: "teste",
        });

        expect(orderEntity.totalPrice).toBe(expectedResult);
      });
    });
  });
});
