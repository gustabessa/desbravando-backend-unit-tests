import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { Order } from "./order.entity";

it("should apply discount to order", () => {
  const order = new Order();
  Reflect.set(order, "totalPrice", 100);
  Reflect.set(order, "discount", 0);
  Reflect.set(order, "discountReason", "");
  Reflect.set(order, "status", EOrderStatus.CREATED);
  Reflect.set(order, "type", EOrderType.PHYSICAL);

  const dto = {
    discount: 10,
    discountReason: "Test discount",
  };

  order.applyDiscount(dto);

  expect(order.discount).toBe(10);
  expect(order.discountReason).toBe("Test discount");
});

it("should throw error when applying discount to promotional order", () => {
  const order = new Order();
  Reflect.set(order, "totalPrice", 100);
  Reflect.set(order, "discount", 0);
  Reflect.set(order, "discountReason", "");
  Reflect.set(order, "status", EOrderStatus.CREATED);
  Reflect.set(order, "type", EOrderType.PHYSICAL);
  Reflect.set(order, "items", [{ isPromotional: true }]);

  const dto = {
    discount: 10,
    discountReason: "Test discount",
  };

  expect(() => order.applyDiscount(dto)).toThrow(
    "Can't apply discount to promotional order"
  );
});

it("should throw error when applying discount to online order", () => {
  const order = new Order();
  Reflect.set(order, "totalPrice", 100);
  Reflect.set(order, "discount", 0);
  Reflect.set(order, "discountReason", "");
  Reflect.set(order, "status", EOrderStatus.CREATED);
  Reflect.set(order, "type", EOrderType.ONLINE);

  const dto = {
    discount: 10,
    discountReason: "Test discount",
  };

  expect(() => order.applyDiscount(dto)).toThrow(
    "Can't apply discount to online order"
  );
});

it("should throw error when applying discount to paid order", () => {
  const order = new Order();
  Reflect.set(order, "totalPrice", 100);
  Reflect.set(order, "discount", 0);
  Reflect.set(order, "discountReason", "");
  Reflect.set(order, "status", EOrderStatus.PAID);
  Reflect.set(order, "type", EOrderType.PHYSICAL);

  const dto = {
    discount: 10,
    discountReason: "Test discount",
  };

  expect(() => order.applyDiscount(dto)).toThrow(
    "Can't apply discount to paid order"
  );
});


