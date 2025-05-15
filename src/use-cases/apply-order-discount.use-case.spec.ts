import { ApplyOrderDiscount } from "./apply-order-discount.use-case";
import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { IEmailProvider } from "../shared/interfaces/providers/email-provider.interface";
import { IMailRepository } from "../shared/interfaces/repositories/email-repository.interface";
import { IOrderRepository } from "../shared/interfaces/repositories/order-repository.interface";
import {
  EmailProviderMock,
  MailRepositoryMock,
  OrderRepositoryMock,
} from "../shared/mocks";
import { IOrder } from "../shared/interfaces/entities/order-entity.interface";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";

describe("ApplyOrderDiscount Use Case", () => {
  const orderRepository = new OrderRepositoryMock();
  const mailRepository = new MailRepositoryMock();
  const emailProvider = new EmailProviderMock();

  const useCase: ApplyOrderDiscount = new ApplyOrderDiscount(
    orderRepository,
    mailRepository,
    emailProvider
  );

  const order = {
    id: 1,
    customer: { email: "teste@teste.com" },
    applyDiscount: jest.fn(),
  };

  const dto: IApplyOrderDiscountDto = {
    discount: 10,
    discountReason: "Promo",
  };

  it("should return an error if order not found", async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, dto)).rejects.toThrowError(
      "Order not found"
    );
  });

  it("should return an error if discount can't be applied", async () => {
    order.applyDiscount.mockImplementation(() => {
      throw new DomainRuleException("");
    });

    orderRepository.findById.mockResolvedValue(order);

    await expect(useCase.execute(1, dto)).rejects.toThrowError();
  });

  it("should apply discount to order", async () => {
    orderRepository.findById.mockResolvedValue(order);
    mailRepository.getApplyOrderDiscountEmail.mockReturnValue({
      body: "Email Body",
      subject: "Email Subject",
    });

    const result = await useCase.execute(1, dto);

    expect(order.applyDiscount).toHaveBeenCalledWith(dto);
    expect(orderRepository.save).toHaveBeenCalledWith(order);
    expect(mailRepository.getApplyOrderDiscountEmail).toHaveBeenCalled();
    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: order.customer.email,
      body: "Email Body",
      subject: "Email Subject",
    });
  });
});
