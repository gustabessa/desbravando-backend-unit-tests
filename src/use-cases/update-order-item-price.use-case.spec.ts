import { UpdateOrderItemPrice } from "./update-order-item-price.use-case";
import { MailRepositoryMock } from "../shared/mocks/mail-repository.mock";
import { EmailProviderMock } from "../shared/mocks/email-provider.mock";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { OrderItem } from "../entities/order-item.entity";
import { OrderRepositoryMock } from "../shared/mocks/order-repository.mock";

enum OrderItemRepositoryMockEnum {
  FOUND = 1,
  NOT_FOUND = 2,
  DOMAIN_RULE_EXCEPTION = 3,
}

const setup = (orderItemTestInstance: OrderItemRepositoryMockEnum) => {
  const orderItemRepositoryMock = new OrderRepositoryMock();
  const mailRepositoryMock = new MailRepositoryMock();
  const emailProviderMock = new EmailProviderMock();
  const updateOrderItemPrice = new UpdateOrderItemPrice(
    orderItemRepositoryMock,
    mailRepositoryMock,
    emailProviderMock
  );

  const orderItemMock = Object.assign(new OrderItem(), {
    id: 1,
    name: "item",
    quantity: 1,
    originalPrice: 100,
    orderPrice: 100,
    isPromotional: false,
    orderId: 1,
    productId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: {
      customer: {
        email: "customer@email.com",
        id: "1",
        name: "Customer",
        orders: [],
      },
    },
    updateOrderPrice: jest.fn(), //sugestao do gpt para mockar o metodo updateOrderPrice eita
  });

  if (orderItemTestInstance === OrderItemRepositoryMockEnum.NOT_FOUND)
    orderItemRepositoryMock.findById.mockResolvedValue(null);

  if (orderItemTestInstance === OrderItemRepositoryMockEnum.FOUND) {
    orderItemRepositoryMock.findById.mockResolvedValue(orderItemMock);

    orderItemMock.updateOrderPrice.mockImplementation((price: number) => {
      orderItemMock.orderPrice = price;
    });
  }

  if (
    orderItemTestInstance === OrderItemRepositoryMockEnum.DOMAIN_RULE_EXCEPTION
  ) {
    orderItemRepositoryMock.findById.mockResolvedValue(orderItemMock);

    orderItemMock.updateOrderPrice.mockImplementation(() => {
      throw new DomainRuleException("Novo preço do item do pedido é mt baixo");
    });
  }

  const orderItemIdMock = 1;
  const newOrderItemPriceMock = 120;

  return {
    updateOrderItemPrice,
    orderItemRepositoryMock,
    mailRepositoryMock,
    emailProviderMock,
    orderItemIdMock,
    newOrderItemPriceMock,
    orderItemMock,
  };
};

describe(UpdateOrderItemPrice.name, () => {
  it("deve lançar erro quando o item do pedido não é encontrado", async () => {
    const { updateOrderItemPrice, orderItemIdMock, newOrderItemPriceMock } =
      setup(OrderItemRepositoryMockEnum.NOT_FOUND);

    await expect(
      updateOrderItemPrice.execute(orderItemIdMock, newOrderItemPriceMock)
    ).rejects.toThrow(Error);
  });

  it("deve atualizar o preço do item do pedido", async () => {
    const {
      updateOrderItemPrice,
      orderItemIdMock,
      newOrderItemPriceMock,
      orderItemRepositoryMock,
      orderItemMock,
    } = setup(OrderItemRepositoryMockEnum.FOUND);

    await expect(
      updateOrderItemPrice.execute(orderItemIdMock, newOrderItemPriceMock)
    ).resolves.toBeUndefined();

    expect(orderItemMock.updateOrderPrice).toHaveBeenCalledWith(
      newOrderItemPriceMock
    );

    expect(orderItemRepositoryMock.save).toHaveBeenCalledWith(orderItemMock);
  });

  it("deve enviar e-mail e lançar DomainRuleException quando regra de domínio for violada", async () => {
    const {
      updateOrderItemPrice,
      orderItemIdMock,
      newOrderItemPriceMock,
      mailRepositoryMock,
      emailProviderMock,
      orderItemMock,
    } = setup(OrderItemRepositoryMockEnum.DOMAIN_RULE_EXCEPTION);

    mailRepositoryMock.getUpdateOrderItemPriceAbove10PercentEmail.mockReturnValue(
      {
        subject: "assunto do email",
        body: "corpo do email",
      }
    );

    await expect(
      updateOrderItemPrice.execute(orderItemIdMock, newOrderItemPriceMock)
    ).rejects.toThrow(DomainRuleException);

    expect(
      mailRepositoryMock.getUpdateOrderItemPriceAbove10PercentEmail
    ).toHaveBeenCalled();

    expect(emailProviderMock.sendEmail).toHaveBeenCalledWith({
      to: orderItemMock.order.customer.email,
      subject: "assunto do email",
      body: "corpo do email",
    });
  });

  it("deve lançar sucesso quando o item do pedido é encontrado e o preço é atualizado", async () => {
    const {
      updateOrderItemPrice,
      orderItemIdMock,
      newOrderItemPriceMock,
      orderItemMock,
      orderItemRepositoryMock,
    } = setup(OrderItemRepositoryMockEnum.FOUND);

    await expect(
      updateOrderItemPrice.execute(orderItemIdMock, newOrderItemPriceMock)
    ).resolves.toBeUndefined();

    expect(orderItemMock.updateOrderPrice).toHaveBeenCalledWith(
      newOrderItemPriceMock
    );

    expect(orderItemRepositoryMock.save).toHaveBeenCalledWith(orderItemMock);
  });
});
