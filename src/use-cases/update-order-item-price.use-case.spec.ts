import { UpdateOrderItemPrice } from "./update-order-item-price.use-case";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { IEmailProvider } from "../shared/interfaces/providers/email-provider.interface";
import { IMailRepository } from "../shared/interfaces/repositories/email-repository.interface";
import { IOrderItemRepository } from "../shared/interfaces/repositories/order-item.repository.interface";
import { MailRepositoryMock } from "../shared/mocks/mail-repository.mock";
import { EmailProviderMock } from "../shared/mocks/email-provider.mock";
import { OrderItemRepositoryMock } from "../shared/mocks";

describe("UpdateOrderItemPrice Use Case", () => {
  const orderItemRepository = new OrderItemRepositoryMock();
  const mailRepository = new MailRepositoryMock();
  const emailProvider = new EmailProviderMock();
  const useCase = new UpdateOrderItemPrice(
    orderItemRepository,
    mailRepository,
    emailProvider
  );

  const orderItemMock = {
    id: 1,
    updateOrderPrice: jest.fn(),
    order: {
      customer: { email: "customer@email.com" },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if order item not found", async () => {
    orderItemRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, 100)).rejects.toThrowError(
      "Order not found"
    );
  });

  it("should update order item price and save", async () => {
    orderItemRepository.findById.mockResolvedValue(orderItemMock);
    orderItemMock.updateOrderPrice.mockImplementation(() => {});
    orderItemRepository.save.mockResolvedValue(undefined);

    await useCase.execute(1, 200);

    expect(orderItemMock.updateOrderPrice).toHaveBeenCalledWith(200);
    expect(orderItemRepository.save).toHaveBeenCalledWith(orderItemMock);
  });

  it("should send email and rethrow if DomainRuleException is thrown", async () => {
    orderItemRepository.findById.mockResolvedValue(orderItemMock);
    const domainError = new DomainRuleException("Domain error");
    orderItemMock.updateOrderPrice.mockImplementation(() => {
      throw domainError;
    });
    mailRepository.getUpdateOrderItemPriceAbove10PercentEmail.mockReturnValue({
      body: "body",
      subject: "subject",
    });

    await expect(useCase.execute(1, 300)).rejects.toThrow(domainError);

    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).toHaveBeenCalled();
    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: "customer@email.com",
      body: "body",
      subject: "subject",
    });
  });

  it("should rethrow non-DomainRuleException errors", async () => {
    orderItemRepository.findById.mockResolvedValue(orderItemMock);
    const genericError = new Error("Generic error");
    orderItemMock.updateOrderPrice.mockImplementation(() => {
      throw genericError;
    });

    await expect(useCase.execute(1, 400)).rejects.toThrow(genericError);

    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).not.toHaveBeenCalled();
    expect(emailProvider.sendEmail).not.toHaveBeenCalled();
  });
});
