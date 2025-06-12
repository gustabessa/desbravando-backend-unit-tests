import { OrderItem } from "../entities/order-item.entity";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { EmailProviderMock } from "../shared/mock/email-provider.mock";
import { MailRepositoryMock } from "../shared/mock/mail-repository.mock";
import { OrderItemRepositoryMock } from "../shared/mock/order-item-repository.mock";
import { UpdateOrderItemPrice } from "./update-order-item-price.use-case";

interface SetupTypes {
  returnOrderItem: boolean;
  returnUpdatePrice: boolean;
  returnErrorUpdated: boolean;
}

const orderItem = {
  id: 1,
  price: 100,
  discount: 10,
  discountReason: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  orderId: 1,
  order: {
    customer: {
      email: "test@example.com",
    },
  },
  updateOrderPrice: jest.fn(),
};

const newOrderItem = {
  id: 1,
  price: 95,
  discount: 10,
  discountReason: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  orderId: 1,
  updateOrderPrice: jest.fn(),
};

const setup = ({
  returnOrderItem,
  returnErrorUpdated,
  returnUpdatePrice = true,
}: SetupTypes) => {
  const orderItemRepositoryMock = new OrderItemRepositoryMock();
  const mailRepositoryMock = new MailRepositoryMock();
  const emailProviderMock = new EmailProviderMock();

  orderItemRepositoryMock.findById.mockResolvedValue(
    returnOrderItem ? orderItem : null
  );

  returnUpdatePrice
    ? orderItem.updateOrderPrice.mockImplementation(() => {
        orderItem.price = newOrderItem.price;
      })
    : orderItem.updateOrderPrice.mockImplementation(() => {
        throw new DomainRuleException("New order price is too low");
      });

  mailRepositoryMock.getApplyOrderDiscountEmail.mockResolvedValue({
    to: orderItem.orderId,
    body: "Email body",
    subject: "Email subject",
  });

  mailRepositoryMock.getUpdateOrderItemPriceAbove10PercentEmail.mockReturnValue(
    {
      body: "Email body for price update",
      subject: "Email subject for price update",
    }
  );

  const updateOrderItemPrice = new UpdateOrderItemPrice(
    orderItemRepositoryMock,
    mailRepositoryMock,
    emailProviderMock
  );

  return {
    orderItemRepositoryMock,
    mailRepositoryMock,
    emailProviderMock,
    updateOrderItemPrice,
  };
};

describe(UpdateOrderItemPrice.name, () => {
  it("should update order item price", async () => {
    const {
      updateOrderItemPrice,
      orderItemRepositoryMock,
      mailRepositoryMock,
      emailProviderMock,
    } = setup({
      returnOrderItem: true,
      returnUpdatePrice: true,
      returnErrorUpdated: false,
    });

    const orderItemId = 1;
    const newPrice = 100;

    const result = await updateOrderItemPrice.execute(orderItemId, newPrice);

    expect(orderItemRepositoryMock.findById).toHaveBeenCalledWith(orderItemId);
    expect(orderItem.updateOrderPrice).toHaveBeenCalledWith(newPrice);
    expect(emailProviderMock.sendEmail).not.toHaveBeenCalled();
  });
  it("should throw error if order item not found", async () => {
    const { updateOrderItemPrice, orderItemRepositoryMock } = setup({
      returnOrderItem: false,
      returnUpdatePrice: true,
      returnErrorUpdated: false,
    });

    const orderItemId = 1;
    const newPrice = 90;

    await expect(
      updateOrderItemPrice.execute(orderItemId, newPrice)
    ).rejects.toThrow("Order not found");
    expect(orderItemRepositoryMock.findById).toHaveBeenCalledWith(orderItemId);
  });

  it("should send email if order item price is above 10 percent", async () => {
    const {
      updateOrderItemPrice,
      orderItemRepositoryMock,
      mailRepositoryMock,
      emailProviderMock,
    } = setup({
      returnOrderItem: true,
      returnUpdatePrice: false,
      returnErrorUpdated: true,
    });

    const orderItemId = 1;
    const newPrice = 8;

    await expect(
      updateOrderItemPrice.execute(orderItemId, newPrice)
    ).rejects.toThrow("New order price is too low");

    expect(emailProviderMock.sendEmail).toHaveBeenCalled();
  });
});
