import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { EmailProviderMock } from "../shared/interfaces/mocks/email-provider";
import { MailRepositoryMock } from "../shared/interfaces/mocks/mail-repository";
import { OrderRepositoryMock } from "../shared/interfaces/mocks/order-item-repository";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";

describe("ApplyOrderDiscount", () => {
  let orderRepository = new OrderRepositoryMock();
  let mailRepository = new MailRepositoryMock();
  let emailProvider = new EmailProviderMock();
  let useCase: ApplyOrderDiscount = new ApplyOrderDiscount(
    orderRepository,
    mailRepository,
    emailProvider
  );

  beforeEach(() => {
    orderRepository = new OrderRepositoryMock();
    mailRepository = new MailRepositoryMock();
    emailProvider = new EmailProviderMock();
    useCase = new ApplyOrderDiscount(
      orderRepository,
      mailRepository,
      emailProvider
    );

    jest.clearAllMocks();
  });

  const mockOrder = {
    id: 1,
    customer: { email: "order@test.com" },
    applyDiscount: jest.fn(),
  };

  it("should throw an error if the order is not found", async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(1, {} as IApplyOrderDiscountDto)
    ).rejects.toThrow("Order not found");
    expect(orderRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should apply discount and send an email", async () => {
    const mockDto: IApplyOrderDiscountDto = {
      discount: 10,
      discountReason: "Special offer",
    };
    const mockEmail = {
      body: "Discount applied",
      subject: "Discount Notification",
    };

    orderRepository.findById.mockResolvedValue(mockOrder);
    mailRepository.getApplyOrderDiscountEmail.mockReturnValue(mockEmail);

    await useCase.execute(1, mockDto);

    expect(orderRepository.findById).toHaveBeenCalledWith(1);
    expect(mockOrder.applyDiscount).toHaveBeenCalledWith(mockDto);
    expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    expect(mailRepository.getApplyOrderDiscountEmail).toHaveBeenCalled();
    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: mockOrder.customer.email,
      body: "Discount applied",
      subject: "Discount Notification",
    });
  });
});
