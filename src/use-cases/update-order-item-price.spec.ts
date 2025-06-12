import { EmailProviderMock } from "../mocks/email-provider.mock";
import { EmailRepositoryMock } from "../mocks/email-repository.mock";
import { OrderItemRepositoryMock } from "../mocks/order-item-repository";
import { UpdateOrderItemPrice } from "./update-order-item-price.use-case";

describe("update-order-item-price", () => {
  const setup = (findByIdReturnIsNull: Boolean) => {
    const orderItemRepositoryMock = new OrderItemRepositoryMock();
    const emailRepositoryMock = new EmailRepositoryMock();
    const emailProviderMock = new EmailProviderMock();

    const orderItem = {
      id: 1,
      name: "Smartphone Samsung Galaxy",
      quantity: 2,
      originalPrice: 899.99,
      orderPrice: 799.99,
      isPromotional: true,
      orderId: 123,
      productId: 456,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: {
        id: 123,
        totalPrice: 1599.98,
        discount: 0,
        discountReason: null,
        status: "PAID",
        type: "PHYSICAL",
        createdAt: new Date(),
        updatedAt: new Date(),
        customerId: 789,
        customer: {
          id: 789,
          name: "John Doe",
          email: "john.doe@example.com",
        },
        items: [],
      },
      product: {
        id: 456,
        name: "Smartphone Samsung Galaxy",
        description: "Smartphone com 128GB de armazenamento",
        price: 899.99,
        category: "Electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      updateOrderPrice: jest.fn(),
    };

    if (findByIdReturnIsNull) {
      orderItemRepositoryMock.findById.mockResolvedValue(null);
    } else {
      orderItemRepositoryMock.findById.mockResolvedValue(orderItem);
    }

    const updateOrderItemPrice = new UpdateOrderItemPrice(
      orderItemRepositoryMock,
      emailRepositoryMock,
      emailProviderMock
    );

    return {
      orderItemRepositoryMock,
      emailRepositoryMock,
      emailProviderMock,
      updateOrderItemPrice,
      orderItem,
    };
  };

  it("should throw an error if order item is not found", async () => {
    const { updateOrderItemPrice } = setup(true);

    await expect(
      async () => await updateOrderItemPrice.execute(1, 8.9)
    ).rejects.toThrow("Order not found");
  });

  it("should update order item price", async () => {
    const { updateOrderItemPrice, orderItem, orderItemRepositoryMock } =
      setup(false);

    await updateOrderItemPrice.execute(1, 8.9);

    expect(orderItem.updateOrderPrice).toHaveBeenCalledWith(8.9);
    expect(orderItemRepositoryMock.save).toHaveBeenCalledWith(orderItem);
  });

  it("should not update order item price if new price is lower than 90% of the original price", async () => {
    const { updateOrderItemPrice, orderItem } = setup(false);

    orderItem.originalPrice = 10;

    orderItem.updateOrderPrice.mockImplementation(() => {
      throw new Error("New order price is too low");
    });

    await expect(
      async () => await updateOrderItemPrice.execute(1, 8.9)
    ).rejects.toThrow("New order price is too low");
  });
});
