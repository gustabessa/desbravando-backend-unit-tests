import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { EmailProviderMock } from "../shared/interfaces/mocks/email-provider";
import { MailRepositoryMock } from "../shared/interfaces/mocks/mail-repository";
import { OrderRepositoryMock } from "../shared/interfaces/mocks/order-item-repository";

import { UpdateOrderItemPrice } from "./update-order-item-price.use-case";

describe("UpdateOrderItemPrice Use case", () => {
  let orderItemRepository = new OrderRepositoryMock();
  let mailRepository = new MailRepositoryMock();
  let emailProvider = new EmailProviderMock();
  const useCase = new UpdateOrderItemPrice(
    orderItemRepository,
    mailRepository,
    emailProvider
  );

  const mockOrderItem = {
    id: 1,
    updateOrderPrice: jest.fn(),
    order: {
      customer: {
        email: "cliente@email.com",
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve atualizar o preço do item do pedido com sucesso", async () => {
    orderItemRepository.findById.mockResolvedValue(mockOrderItem);

    await useCase.execute(1, 200);

    expect(mockOrderItem.updateOrderPrice).toHaveBeenCalledWith(200);
    expect(orderItemRepository.save).toHaveBeenCalledWith(mockOrderItem);
  });

  it("deve gerar erro se o item do pedido não for encontrado", async () => {
    orderItemRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(99, 200)).rejects.toThrow("Order not found");
  });

  it("deve enviar e-mail e lançar novamente se DomainRuleException for lançado", async () => {
    const emailContent = {
      subject: "Alerta de preço",
      body: "O preço foi alterado em mais de 10%",
    };

    mockOrderItem.updateOrderPrice.mockImplementation(() => {
      throw new DomainRuleException("Mudança acima do permitido");
    });

    mailRepository.getUpdateOrderItemPriceAbove10PercentEmail.mockReturnValue(
      emailContent
    );
    orderItemRepository.findById.mockResolvedValue(mockOrderItem);

    await expect(useCase.execute(1, 500)).rejects.toThrow(DomainRuleException);

    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).toHaveBeenCalled();
    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: "cliente@email.com",
      subject: emailContent.subject,
      body: emailContent.body,
    });
  });

  //se o erro for qualquer outra exceção diferente de DomainRuleException, o e-mail NÃO será enviado, porque o código dentro do if não vai ser executado.
  it("deve relançar qualquer outra exceção sem enviar e-mail", async () => {
    mockOrderItem.updateOrderPrice.mockImplementation(() => {
      throw new Error("Erro inesperado");
    });

    orderItemRepository.findById.mockResolvedValue(mockOrderItem);

    await expect(useCase.execute(1, 300)).rejects.toThrow("Erro inesperado");

    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).not.toHaveBeenCalled();
    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: mockOrderItem.order.customer.email,
      subject: "Desconto aplicado com sucesso",
      body: "Seu pedido recebeu um desconto de 10%",
    });
  });
});
