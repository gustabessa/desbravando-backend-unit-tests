import { EmailRepositoryMock } from "../mocks/email-repository.mock";
import { EmailProviderMock } from "../mocks/email-provider.mock";
import { OrderRepositoryMock } from "../mocks/order-repository.mock";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";
import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";

describe("apply-order-discount", () => {
  it("should throw an error if order is not found", async () => {
    const orderRepositoryMock = new OrderRepositoryMock();
    orderRepositoryMock.findById.mockResolvedValue(null);

    const emailRepositoryMock = new EmailRepositoryMock();
    const emailProviderMock = new EmailProviderMock();

    const applyOrderDiscount = new ApplyOrderDiscount(
      orderRepositoryMock,
      emailRepositoryMock,
      emailProviderMock
    );

    await expect(
      async () =>
        await applyOrderDiscount.execute(1, {
          discount: 2,
          discountReason: "teste",
        })
    ).rejects.toThrow("Order not found");
  });

  it("should apply discount to order and send email", async () => {
    const orderRepositoryMock = new OrderRepositoryMock();
    const order = {
      id: 1,
      totalPrice: 100,
      discount: 10,
      discountReason: "Test discount",
      status: EOrderStatus.PAID,
      type: EOrderType.PHYSICAL,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerId: 123,
      customer: {
        id: 123,
        name: "John Doe",
        email: "john.doe@example.com",
      },
      items: [
        {
          id: 1,
          name: "Product A",
          price: 50,
          isPromotional: true,
        },
        {
          id: 2,
          name: "Product B",
          price: 50,
          isPromotional: false,
        },
      ],
      applyDiscount: jest.fn(),
    };
    orderRepositoryMock.findById.mockResolvedValue(order);

    const emailRepositoryMock = new EmailRepositoryMock();

    const emailProviderMock = new EmailProviderMock();

    const applyOrderDiscount = new ApplyOrderDiscount(
      orderRepositoryMock,
      emailRepositoryMock,
      emailProviderMock
    );

    await applyOrderDiscount.execute(1, {
      discount: 1,
      discountReason: "Test discount",
    });

    expect(order.applyDiscount).toHaveBeenCalledWith({
      discount: 1,
      discountReason: "Test discount",
    });

    expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
    expect(emailRepositoryMock.getApplyOrderDiscountEmail).toHaveBeenCalled();
    expect(emailProviderMock.sendEmail).toHaveBeenCalledWith({
      to: order.customer.email,
      body: emailRepositoryMock.getApplyOrderDiscountEmail().body,
      subject: emailRepositoryMock.getApplyOrderDiscountEmail().subject,
    });
  });
});
