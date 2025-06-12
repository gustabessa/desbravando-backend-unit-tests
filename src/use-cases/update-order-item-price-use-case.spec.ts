import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { UpdateOrderItemPrice } from "./update-order-item-price.use-case";

describe("UpdateOrderItemPriceUseCase", () => {
  const orderItemRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  const mailRepository = {
    getApplyOrderDiscountEmail: jest.fn(),
    getUpdateOrderItemPriceAbove10PercentEmail: jest.fn(),
  };

  const emailProvider = {
    sendEmail: jest.fn(),
  };

  const updateOrderItemPriceUseCase = new UpdateOrderItemPrice(
    orderItemRepository,
    mailRepository,
    emailProvider
  );

  const orderItemId = 1;
  const newOrdemItemPrice = 100;

  const mockOrderItem = {
    id: orderItemId,
    order: {
      customer: {
        email: "email@example.com",
      },
    },
    updateOrderPrice: jest.fn(),
  };

  it("should throw an error if order item not found", async () => {
    orderItemRepository.findById.mockResolvedValue(null);

    await expect(
      updateOrderItemPriceUseCase.execute(orderItemId, newOrdemItemPrice)
    ).rejects.toThrow("Order not found");
    expect(orderItemRepository.save).not.toHaveBeenCalled();
    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).not.toHaveBeenCalled();
    expect(emailProvider.sendEmail).not.toHaveBeenCalled();
  });

  it("should update order item price and save order item", async () => {
    orderItemRepository.findById.mockResolvedValue(mockOrderItem);

    await updateOrderItemPriceUseCase.execute(orderItemId, newOrdemItemPrice);
    expect(orderItemRepository.findById).toHaveBeenCalledWith(orderItemId);
    expect(mockOrderItem.updateOrderPrice).toHaveBeenCalledWith(
      newOrdemItemPrice
    );
    expect(orderItemRepository.save).toHaveBeenCalledWith(mockOrderItem);
    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).not.toHaveBeenCalled();
    expect(emailProvider.sendEmail).not.toHaveBeenCalled();
  });

  it("should send email if price increase is above 10%", async () => {
    const mockError = new DomainRuleException("Price increase above 10%");

    orderItemRepository.findById.mockResolvedValue(mockOrderItem);

    await updateOrderItemPriceUseCase.execute(orderItemId, newOrdemItemPrice);
    expect(orderItemRepository.findById).toHaveBeenCalledWith(orderItemId);
  });
});
