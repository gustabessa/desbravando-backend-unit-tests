import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { ICustomer } from "../shared/interfaces/entities/customer-entity.interface";
import { EmailProviderMock } from "../shared/mocks/mail-provider.mock";
import { EmailRepositoryMock } from "../shared/mocks/mail-repository.mock";
import { OrderRepositoryMock } from "../shared/mocks/order-repository.mock";
import { OrderMock } from "../shared/mocks/order.mock";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";
import { UpdateOrderItemPrice } from "./update-order-item-price.use-case";

describe("updateOrderItemPrice", () => {
  const setup = () => {
    const orderRepositoryMock = new OrderRepositoryMock();

    const mailRepositoryMock = new EmailRepositoryMock();

    const emailProviderMock = new EmailProviderMock();

    const orderMock = new OrderMock();

    orderMock.customer = {
      email: "teste",
    } as unknown as ICustomer;

    mailRepositoryMock.getApplyOrderDiscountEmail.mockReturnValue({
      body: "Test body",
      subject: "Test subject",
    });

    const updateOrderItemPrice = new UpdateOrderItemPrice(
      orderRepositoryMock,
      mailRepositoryMock,
      emailProviderMock
    );

    const orderId = 1;

    const newOrderItemPrice = 10;

    return {
      orderRepositoryMock,
      orderMock,
      orderId,
      newOrderItemPrice,
      updateOrderItemPrice,
      mailRepositoryMock,
      emailProviderMock,
    };
  };

  it("should error if order not found", async () => {
    const {
      updateOrderItemPrice,
      newOrderItemPrice,
      orderId,
      orderRepositoryMock,
    } = setup();

    orderRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      updateOrderItemPrice.execute(orderId, newOrderItemPrice)
    ).rejects.toThrow("Order not found");

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("should successfully update order item price", async () => {});
});
