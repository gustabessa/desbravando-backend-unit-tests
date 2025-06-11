import { Order } from "../entities/order.entity";
import { EmailProviderMock } from "../shared/mocks/email-provider-repository.mock";
import { OrderRepositoryMock } from "../shared/mocks/order-repository.mock";
import { Customer } from "./../entities/customer.entity";
import { MailRepositoryMock } from "./../shared/mocks/mail-repository.mock";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";

interface setupProps {
  returnOrder?: boolean;
}

const setup = ({ returnOrder = true }: setupProps) => {
  const orderRepositoryMock = new OrderRepositoryMock();
  const mailRepositoryMock = new MailRepositoryMock();
  const emailProviderMock = new EmailProviderMock();

  const applyOrderDiscountMock = new ApplyOrderDiscount(
    orderRepositoryMock,
    mailRepositoryMock,
    emailProviderMock
  );

  const orderMock: Order = new Order();

  Object.assign(orderMock, {
    id: 1,
    totalPrice: 100,
    customer: {
      email: "test@example.com",
    },
    applyDiscount: jest.fn(),
  });

  returnOrder
    ? orderRepositoryMock.findById.mockResolvedValueOnce(orderMock)
    : orderRepositoryMock.findById.mockResolvedValueOnce(null);

  mailRepositoryMock.getApplyOrderDiscountEmail.mockReturnValueOnce({
    to: "test@example.com",
    body: "Test body",
    subject: "Test subject",
  });

  return {
    returnOrder,
    emailProviderMock,
    applyOrderDiscountMock,
    orderMock,
  };
};

describe(ApplyOrderDiscount.name, () => {
  it("should return error when do not find order", () => {
    const { applyOrderDiscountMock } = setup({
      returnOrder: false,
    });

    expect(
      applyOrderDiscountMock.execute(1, {
        discount: 10,
        discountReason: "Test",
      })
    ).rejects.toThrow("Order not found");
  });

  it("should apply discount to order and send email", async () => {
    const { orderMock, applyOrderDiscountMock, emailProviderMock } = setup({});

    await applyOrderDiscountMock.execute(orderMock.id, {
      discount: 10,
      discountReason: "Test",
    });

    expect(orderMock.applyDiscount).toHaveBeenCalledWith({
      discount: 10,
      discountReason: "Test",
    });
    expect(emailProviderMock.sendEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      body: "Test body",
      subject: "Test subject",
    });
  });
});
