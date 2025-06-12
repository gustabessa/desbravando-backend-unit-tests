import { Order } from "../entities/order.entity";
import { EmailProviderMock } from "../shared/mock/email-provider.mock";
import { MailRepositoryMock } from "../shared/mock/mail-repository.mock";
import { OrderRepositoryMock } from "../shared/mock/order-repository.mock";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";

interface setupTypes {
  returnOrder: boolean;
  returnEmail: boolean;
}

const order = {
  id: 1,
  totalPrice: 100,
  discount: 0,
  discountReason: "",
  status: "CREATED",
  type: "PHYSICAL",
  createdAt: new Date(),
  updatedAt: new Date(),
  customerId: 1,
  customer: {
    id: "1",
    name: "John Doe",
    email: "",
  },
  items: [],
  applyDiscount: jest.fn(),
};

const setup = ({ returnOrder, returnEmail }: setupTypes) => {
  const orderRepositoryMock = new OrderRepositoryMock();
  const mailRepositoryMock = new MailRepositoryMock();
  const emailProviderMock = new EmailProviderMock();

  orderRepositoryMock.findById = jest
    .fn()
    .mockResolvedValue(returnOrder ? order : null);

  mailRepositoryMock.getApplyOrderDiscountEmail = jest.fn().mockReturnValue({
    body: "Email body",
    subject: "Email subject",
  });

  const applyOrderDiscount = new ApplyOrderDiscount(
    orderRepositoryMock,
    mailRepositoryMock,
    emailProviderMock
  );

  return {
    applyOrderDiscount,
    orderRepositoryMock,
    mailRepositoryMock,
    emailProviderMock,
  };
};

describe(ApplyOrderDiscount.name, () => {
  it("should apply discount to order", async () => {
    const {
      applyOrderDiscount,
      orderRepositoryMock,
      mailRepositoryMock,
      emailProviderMock,
    } = setup({ returnOrder: true, returnEmail: true });

    const orderId = 1;
    const dto = {
      discount: 20,
      discountReason: "Special promotion",
    };

    await applyOrderDiscount.execute(orderId, dto);

    expect(orderRepositoryMock.save).toHaveBeenCalled();
    expect(mailRepositoryMock.getApplyOrderDiscountEmail).toHaveBeenCalled();
    expect(emailProviderMock.sendEmail).toHaveBeenCalled();
  });

  it("should throw error if order not found", async () => {
    const { applyOrderDiscount, orderRepositoryMock } = setup({
      returnOrder: false,
      returnEmail: true,
    });

    const orderId = 1;
    const dto = {
      discount: 20,
      discountReason: "Special promotion",
    };

    await expect(applyOrderDiscount.execute(orderId, dto)).rejects.toThrow(
      "Order not found"
    );

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("should send email with correct parameters", async () => {
    const {
      applyOrderDiscount,
      orderRepositoryMock,
      mailRepositoryMock,
      emailProviderMock,
    } = setup({ returnOrder: true, returnEmail: true });

    const orderId = 1;
    const dto = {
      discount: 20,
      discountReason: "Special promotion",
    };

    await applyOrderDiscount.execute(orderId, dto);

    expect(emailProviderMock.sendEmail).toHaveBeenCalledWith({
      to: order.customer.email,
      body: "Email body",
      subject: "Email subject",
    });
  });
});
