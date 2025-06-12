import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { Order } from "./order.entity";

describe("OrderEntity", () => {
  //usando o describe para agrupar os testes
  describe("[applyDiscount]", () => {
    const defaultDiscount = { discount: 10, discountReason: "Test" };
    const higherDiscount = { discount: 20, discountReason: "Test" };

    it("deve lançar erro quando o pedido tem itens promocionais", () => {
      // usando o Object.assign para criar um novo objeto com as propriedades do Order
      const order = Object.assign(new Order(), {
        items: [{ isPromotional: true } as any],
        type: EOrderType.PHYSICAL,
        status: EOrderStatus.CREATED,
        totalPrice: 100,
        discount: 0,
      });

      expect(() => {
        order.applyDiscount(defaultDiscount);
      }).toThrow(DomainRuleException);
    });

    it("deve lançar erro quando o pedido é online", () => {
      const order = Object.assign(new Order(), {
        items: [{ isPromotional: false } as any],
        type: EOrderType.ONLINE,
        status: EOrderStatus.CREATED,
        totalPrice: 100,
        discount: 0,
      });

      expect(() => {
        order.applyDiscount(defaultDiscount);
      }).toThrow(DomainRuleException);
    });

    it("deve lançar erro quando o pedido está pago", () => {
      const order = Object.assign(new Order(), {
        items: [{ isPromotional: false } as any],
        type: EOrderType.PHYSICAL,
        status: EOrderStatus.PAID,
        totalPrice: 100,
        discount: 0,
      });

      expect(() => {
        order.applyDiscount(defaultDiscount);
      }).toThrow(DomainRuleException);
    });

    it("deve aplicar o desconto corretamente", () => {
      const order = Object.assign(new Order(), {
        items: [{ isPromotional: false } as any],
        type: EOrderType.PHYSICAL,
        status: EOrderStatus.CREATED,
        totalPrice: 100,
        discount: 0,
      });

      order.applyDiscount(defaultDiscount);

      expect(order.discount).toBe(10);
      expect(order.discountReason).toBe("Test");
      expect(order.totalPrice).toBe(90);
    });

    it("deve atualizar o desconto corretamente quando já existe um desconto anterior", () => {
      const order = new Order();
      order.items = [{ isPromotional: false } as any];
      order.type = EOrderType.PHYSICAL;
      order.status = EOrderStatus.CREATED;
      order.totalPrice = 90;
      order.discount = 10;

      order.applyDiscount(higherDiscount);

      expect(order.discount).toBe(20);
      expect(order.discountReason).toBe("Test");
      expect(order.totalPrice).toBe(80);
    });
  });
});
