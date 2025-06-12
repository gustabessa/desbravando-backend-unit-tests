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

  const useCase = new UpdateOrderItemPrice(
    orderItemRepository,
    mailRepository,
    emailProvider
  );

  const orderItemId = 1;
  const newOrderItemPrice = 100;

  const createMockOrderItem = () => ({
    id: orderItemId,
    order: {
      customer: {
        email: "email@example.com",
      },
    },
    updateOrderPrice: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if order item not found", async () => {
    orderItemRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(orderItemId, newOrderItemPrice)
    ).rejects.toThrow("Order not found");

    expect(orderItemRepository.save).not.toHaveBeenCalled();
    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).not.toHaveBeenCalled();
    expect(emailProvider.sendEmail).not.toHaveBeenCalled();
  });

  it("should update order item price and save order item", async () => {
    const mockOrderItem = createMockOrderItem();
    orderItemRepository.findById.mockResolvedValue(mockOrderItem);

    await useCase.execute(orderItemId, newOrderItemPrice);

    expect(orderItemRepository.findById).toHaveBeenCalledWith(orderItemId);
    expect(mockOrderItem.updateOrderPrice).toHaveBeenCalledWith(
      newOrderItemPrice
    );
    expect(orderItemRepository.save).toHaveBeenCalledWith(mockOrderItem);
    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).not.toHaveBeenCalled();
    expect(emailProvider.sendEmail).not.toHaveBeenCalled();
  });

  it("should send email if price increase is above 10%", async () => {
    const mockOrderItem = createMockOrderItem();
    const mockError = new DomainRuleException("Price increase above 10%");
    const emailBody = "email body";
    const emailSubject = "subject";

    mockOrderItem.updateOrderPrice.mockImplementation(() => {
      throw mockError;
    });

    mailRepository.getUpdateOrderItemPriceAbove10PercentEmail.mockReturnValue({
      body: emailBody,
      subject: emailSubject,
    });

    orderItemRepository.findById.mockResolvedValue(mockOrderItem);

    await expect(
      useCase.execute(orderItemId, newOrderItemPrice)
    ).rejects.toThrow(mockError);

    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).toHaveBeenCalled();
    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: "email@example.com",
      body: emailBody,
      subject: emailSubject,
    });
  });

  it("should not send email if unknown error occurs", async () => {
    const mockOrderItem = createMockOrderItem();
    const unknownError = new Error("Unexpected error");

    mockOrderItem.updateOrderPrice.mockImplementation(() => {
      throw unknownError;
    });

    orderItemRepository.findById.mockResolvedValue(mockOrderItem);

    await expect(
      useCase.execute(orderItemId, newOrderItemPrice)
    ).rejects.toThrow(unknownError);

    expect(
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
    ).not.toHaveBeenCalled();
    expect(emailProvider.sendEmail).not.toHaveBeenCalled();
  });

  it("should not save if updateOrderPrice throws DomainRuleException", async () => {
    const mockOrderItem = createMockOrderItem();
    const mockError = new DomainRuleException("Price increase above 10%");

    mockOrderItem.updateOrderPrice.mockImplementation(() => {
      throw mockError;
    });

    mailRepository.getUpdateOrderItemPriceAbove10PercentEmail.mockReturnValue({
      body: "body",
      subject: "subject",
    });

    orderItemRepository.findById.mockResolvedValue(mockOrderItem);

    await expect(
      useCase.execute(orderItemId, newOrderItemPrice)
    ).rejects.toThrow(mockError);

    expect(orderItemRepository.save).not.toHaveBeenCalled();
  });
});
