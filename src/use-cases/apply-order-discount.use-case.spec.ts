import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { ICustomer } from "../shared/interfaces/entities/customer-entity.interface";
import { EmailProviderMock } from "../shared/mocks/mail-provider.mock";
import { EmailRepositoryMock } from "../shared/mocks/mail-repository.mock";
import { OrderRepositoryMock } from "../shared/mocks/order-repository.mock";
import { OrderMock } from "../shared/mocks/order.mock";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";

describe("ApplyOrderDiscount", () => {
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

    const applyOrderDiscount = new ApplyOrderDiscount(
      orderRepositoryMock,
      mailRepositoryMock,
      emailProviderMock
    );

    const orderId = 1;

    const dto: IApplyOrderDiscountDto = {
      discount: 10,
      discountReason: "Test reason",
    };

    return {
      orderRepositoryMock,
      orderMock,
      orderId,
      dto,
      applyOrderDiscount,
      mailRepositoryMock,
      emailProviderMock,
    };
  };

  it("should error if order not found", async () => {
    const { applyOrderDiscount, dto, orderId, orderRepositoryMock } = setup();

    orderRepositoryMock.findById.mockResolvedValue(null);

    await expect(applyOrderDiscount.execute(orderId, dto)).rejects.toThrow(
      "Order not found"
    );

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);

    expect(orderRepositoryMock.save).not.toHaveBeenCalled();
  });

  it("should apply discount", async () => {
    const {
      applyOrderDiscount,
      dto,
      orderId,
      orderMock,
      orderRepositoryMock,
      emailProviderMock,
      mailRepositoryMock,
    } = setup();

    orderRepositoryMock.findById.mockResolvedValue(orderMock);

    await expect(
      applyOrderDiscount.execute(orderId, dto)
    ).resolves.not.toThrow();

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);

    expect(orderMock.applyDiscount).toHaveBeenCalledWith(dto);

    expect(orderRepositoryMock.save).toHaveBeenCalled();

    expect(mailRepositoryMock.getApplyOrderDiscountEmail).toHaveBeenCalled();

    expect(emailProviderMock.sendEmail).toHaveBeenCalledWith({
      to: orderMock.customer.email,
      body: mailRepositoryMock.getApplyOrderDiscountEmail().body,
      subject: mailRepositoryMock.getApplyOrderDiscountEmail().subject,
    });
  });
});
