import { Customer } from "../entities/customer.entity";
import { Order } from "../entities/order.entity";
import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { EmailProviderMock } from "../shared/mocks/email-provider.mock";
import { MailRepositoryMock } from "../shared/mocks/mail-repository.mock";
import { OrderItemRepositoryMock } from "../shared/mocks/order-item-repository.mock";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";

describe("ApplyOrderDiscountUseCase", () => {
  describe("[execute]", () => {
    let applyOrderDiscountUseCase: ApplyOrderDiscount;
    let orderRepository: OrderItemRepositoryMock;
    let mailRepository: MailRepositoryMock;
    let emailProvider: EmailProviderMock;

    const dto: IApplyOrderDiscountDto = {
      discount: 10,
      discountReason: "Test",
    };

    beforeEach(() => {
      orderRepository = new OrderItemRepositoryMock();

      mailRepository = new MailRepositoryMock();

      emailProvider = new EmailProviderMock();

      applyOrderDiscountUseCase = new ApplyOrderDiscount(
        orderRepository,
        mailRepository,
        emailProvider
      );
    });

    it("Should return an error if order not found", async () => {
      const orderId = 1;

      orderRepository.findById.mockResolvedValue(null);

      await expect(
        applyOrderDiscountUseCase.execute(orderId, dto)
      ).rejects.toThrow("Order not found");
    });

    it("should apply discount and send email when order is found", async () => {
      const orderId = 1;
      const mockOrder = new Order();
      const mockCustomer = new Customer();

      const mockBody = "Email Body";
      const mockSubject = "Email Subject";

      Object.assign(mockCustomer, {
        email: "teste@gmail.com",
      });

      Object.assign(mockOrder, {
        id: orderId,
        customer: mockCustomer,
        applyDiscount: jest.fn(),
      });

      orderRepository.findById.mockResolvedValue(mockOrder);
      mailRepository.getApplyOrderDiscountEmail.mockReturnValue({
        body: mockBody,
        subject: mockSubject,
      });

      await applyOrderDiscountUseCase.execute(orderId, dto);

      expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(mockOrder.applyDiscount).toHaveBeenCalledWith(dto);
      expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
      expect(mailRepository.getApplyOrderDiscountEmail).toHaveBeenCalled();
      expect(emailProvider.sendEmail).toHaveBeenCalledWith({
        to: mockCustomer.email,
        body: mockBody,
        subject: mockSubject,
      });
    });
  });
});
