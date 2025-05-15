import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";

describe("ApplyOrderDiscountUseCase", () => {
  const orderRepository = {
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

  const applyOrderDiscount = new ApplyOrderDiscount(
    orderRepository,
    mailRepository,
    emailProvider
  );

  const orderId = 1;
  const dto: IApplyOrderDiscountDto = {
    discount: 10,
    discountReason: "Test",
  };

  const mockOrder = {
    customer: { email: "customer@example.com" },
    applyDiscount: jest.fn(),
  };

  it("should throw an error if order not found", async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(applyOrderDiscount.execute(orderId, dto)).rejects.toThrow(
      "Order not found"
    );
    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(emailProvider.sendEmail).not.toHaveBeenCalled();
  });

  it("should apply discount, save order and send email", async () => {
    orderRepository.findById.mockResolvedValue(mockOrder);
    mailRepository.getApplyOrderDiscountEmail.mockReturnValue({
      body: 'Discount applied successfully!',
      subject: 'Your order has a discount',
    });

    await applyOrderDiscount.execute(orderId, dto);

    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(mockOrder.applyDiscount).toHaveBeenCalledWith(dto);
    expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    expect(mailRepository.getApplyOrderDiscountEmail).toHaveBeenCalled();

    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: mockOrder.customer.email,
      body:'Discount applied successfully!',
      subject: 'Your order has a discount',
    });
  });
});
