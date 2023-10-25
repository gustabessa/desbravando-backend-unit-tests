import { EOrderStatus } from '../shared/enums/order-status.enum';
import { EOrderType } from '../shared/enums/order-type.enum';
import { DomainRuleException } from '../shared/errors/domain-rule-exception';
import { Order } from './order.entity';

describe('OrderEntity', () => {
  describe('applyDiscount', () => {
    it('should not apply discount if has some promotional item', () => {
      const ordemItem = new Order();
      Reflect.set(ordemItem, 'items', [
        { isPromotional: true },
        { isPromotional: false },
      ]);

      expect(() =>
        ordemItem.applyDiscount({ discount: 10, discountReason: '' })
      ).toThrow(DomainRuleException);
    });

    it('should not apply discount if order type is online', () => {
      const ordemItem = new Order();
      Reflect.set(ordemItem, 'type', EOrderType.ONLINE);

      expect(() =>
        ordemItem.applyDiscount({ discount: 10, discountReason: '' })
      ).toThrow(DomainRuleException);
    });

    it('should not apply discount if order status is paid', () => {
      const ordemItem = new Order();
      Reflect.set(ordemItem, 'status', EOrderStatus.PAID);

      expect(() =>
        ordemItem.applyDiscount({ discount: 10, discountReason: '' })
      ).toThrow(DomainRuleException);
    });
  });
});
