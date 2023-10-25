import {Order} from "./order.entity";
import {IOrderItem} from "../shared/interfaces/entities/order-item-entity.interface";
import {IApplyOrderDiscountDto} from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import {EOrderType} from "../shared/enums/order-type.enum";
import {EOrderStatus} from "../shared/enums/order-status.enum";

describe("OrderEntity", ()=> {
    describe("[applyDiscount]", ()=> {
        const dtoMock: IApplyOrderDiscountDto = { discount: 1, discountReason: '' };

        it("should not be apply discount to promotional order", ()=> {
            const orderItemMock: IOrderItem[] = [{
                isPromotional: true
            }] as IOrderItem[];

            const orderEntity = new Order();
            Reflect.set(orderEntity, 'items', orderItemMock);

            expect(()=> orderEntity.applyDiscount(dtoMock)).toThrowError();
        })

        it("should not be can't apply discount to online order", ()=> {
            const orderItemMock: IOrderItem[] = [{
                isPromotional: false
            }] as IOrderItem[];

            const orderEntity = new Order();
            Reflect.set(orderEntity, 'items', orderItemMock);
            Reflect.set(orderEntity, 'type', EOrderType.ONLINE);

            expect(()=> orderEntity.applyDiscount(dtoMock)).toThrowError();
        })

        it("should not be can't apply discount to paid order", ()=> {
            const orderItemMock: IOrderItem[] = [{
                isPromotional: false
            }] as IOrderItem[];

            const orderEntity = new Order();
            Reflect.set(orderEntity, 'items', orderItemMock);
            Reflect.set(orderEntity, 'type', EOrderType.PHYSICAL);
            Reflect.set(orderEntity, 'status', EOrderStatus.PAID);

            expect(()=> orderEntity.applyDiscount(dtoMock)).toThrowError();
        })

        it("should be can apply discount", ()=> {
            const orderItemMock: IOrderItem[] = [{
                isPromotional: false
            }] as IOrderItem[];

            const orderEntity = new Order();
            Reflect.set(orderEntity, 'items', orderItemMock);
            Reflect.set(orderEntity, 'type', EOrderType.PHYSICAL);
            Reflect.set(orderEntity, 'status', EOrderStatus.CREATED);

            orderEntity.applyDiscount(dtoMock);

            expect(orderEntity.discount).toBe(1);
        })
    })
})