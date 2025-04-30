import { Order } from "../../src/entities/order.entity";
import {DomainRuleException} from "../shared/errors/domain-rule-exception";

describe("OrderEntity", () => {
    describe("[applyDiscount]", () => {
        it("should not apply discount if some item is promotional", () => {
            const orderEntity = new Order();
            Reflect.set(orderEntity, "items", [
                { isPromotional: false },
            ]);

            expect(() => {
                orderEntity.applyDiscount({
                    discount: 10,
                    discountReason: "Promotional item test",
                });
            }).toThrow(DomainRuleException);
        });

        it("should not apply discount if some order is online", () => {
            const orderEntity = new Order();
            Reflect.set(orderEntity, "type", "ONLINE");

            expect(() => {
                orderEntity.applyDiscount({
                    discount: 10,
                    discountReason: "Online order test",
                });
            }).toThrow(DomainRuleException);
        });

        it("should not apply discount if order is paid", () => {
            const orderEntity = new Order();
            Reflect.set(orderEntity, "status", "PAID");

            expect(() => {
                orderEntity.applyDiscount({
                    discount: 10,
                    discountReason: "Paid order test",
                });
            }).toThrow(DomainRuleException);
        })

    })
})