import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { OrderItem } from "./order-item.entity";
import { Order } from "./order.entity";

describe("OrderEntity", () => {
  describe("[applyDiscount]", () => {
    const discountDto = {
      discount: 10,
      discountReason: "Test",
    };

    const discount = 20;
    const discountReason = "MOCK TEST";
    const totalPrice = 100;

    it("should throw an DomainRuleException if some item in order is promotional", () => {
      const mockOrderItem = new OrderItem();
      Reflect.set(mockOrderItem, "isPromotional", true);
      const mockPromotionalOrderItems = [mockOrderItem];

      const mockOrder = new Order();
      Reflect.set(mockOrder, "items", mockPromotionalOrderItems);

      expect(() => {
        mockOrder.applyDiscount(discountDto);
      }).toThrow(DomainRuleException);
    });

    it("should throw an DomainRuleException if order type is online", () => {
      const mockOrder = new Order();
      Reflect.set(mockOrder, "type", EOrderType.ONLINE);

      expect(() => {
        mockOrder.applyDiscount(discountDto);
      }).toThrow(DomainRuleException);
    });

    it("should throw an DomainRuleException if order status is paid", () => {
      const mockOrder = new Order();
      Reflect.set(mockOrder, "status", EOrderStatus.PAID);

      expect(() => {
        mockOrder.applyDiscount(discountDto);
      }).toThrow(DomainRuleException);
    });

    it("should apply discount to order when valid order to apply", () => {
      const mockOrder = new Order();
      Object.assign(mockOrder, {
        type: EOrderType.PHYSICAL,
        status: EOrderStatus.CREATED,
        discount: discount,
        discountReason: discountReason,
        totalPrice: totalPrice,
      });

      mockOrder.applyDiscount(discountDto);

      const discountDifference = discountDto.discount - discount;
      const totalPriceResult = totalPrice - discountDifference;

      expect(mockOrder.discount).toBe(discountDto.discount);
      expect(mockOrder.discountReason).toBe(discountDto.discountReason);
      expect(mockOrder.totalPrice).toBe(totalPriceResult);
    });
  });
});
