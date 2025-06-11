import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { IOrderItem } from "../shared/interfaces/entities/order-item-entity.interface";
import { EmailProviderMock } from "../shared/mocks/email-provider-repository.mock";
import { OrderItemRepositoryMock } from "../shared/mocks/order-item-repository.mock";
import { MailRepositoryMock } from "./../shared/mocks/mail-repository.mock";
import { UpdateOrderItemPrice } from "./update-order-item-price.use-case";

interface setupProps {
  returnOrderItem?: boolean;
  updateOrderItemPriceshouldReturnError?: boolean;
}

const setup = ({
  returnOrderItem = true,
  updateOrderItemPriceshouldReturnError = false,
}: setupProps) => {
  const orderItemRepository = new OrderItemRepositoryMock();
  const mailRepositoryMock = new MailRepositoryMock();
  const emailProviderMock = new EmailProviderMock();

  const updateOrderItemPriceMock = new UpdateOrderItemPrice(
    orderItemRepository,
    mailRepositoryMock,
    emailProviderMock
  );

  const orderItemMock = {
    id: 1,
    updateOrderPrice: jest.fn(() => {
      if (updateOrderItemPriceshouldReturnError) {
        throw new DomainRuleException("Test");
      }
    }),
    order: {
      customer: {
        email: "test@example.com",
      },
    },
  } as unknown as IOrderItem;

  returnOrderItem
    ? orderItemRepository.findById.mockResolvedValueOnce(orderItemMock)
    : orderItemRepository.findById.mockResolvedValueOnce(null);

  mailRepositoryMock.getUpdateOrderItemPriceAbove10PercentEmail.mockReturnValueOnce(
    {
      body: "Test body",
      subject: "Test subject",
    }
  );

  return {
    returnOrderItem,
    orderItemRepository,
    updateOrderItemPriceMock,
    orderItemMock,
  };
};

describe(UpdateOrderItemPrice.name, () => {
  it("should return error when do not find orderItem", () => {
    const { updateOrderItemPriceMock } = setup({
      returnOrderItem: false,
    });

    expect(updateOrderItemPriceMock.execute(1, 10)).rejects.toThrow(
      "OrderItem not found"
    );
  });

  it("should return error when updateOrderPrice throw error", () => {
    const { updateOrderItemPriceMock } = setup({
      updateOrderItemPriceshouldReturnError: true,
    });

    expect(updateOrderItemPriceMock.execute(1, 10)).rejects.toThrow("Test");
  });

  it("should update discount to order and send email", async () => {
    const { orderItemRepository, orderItemMock, updateOrderItemPriceMock } =
      setup({});

    await updateOrderItemPriceMock.execute(orderItemMock.id, 10);

    expect(orderItemRepository.save).toHaveBeenCalled();
  });
});
