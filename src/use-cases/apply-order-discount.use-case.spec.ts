import { IOrder } from "./../shared/interfaces/entities/order-entity.interface";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";
import { IOrderRepository } from "../shared/interfaces/repositories/order-repository.interface";
import { IMailRepository } from "../shared/interfaces/repositories/email-repository.interface";
import { IEmailProvider } from "../shared/interfaces/providers/email-provider.interface";
import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { ICustomer } from "../shared/interfaces/entities/customer-entity.interface";

describe("ApplyOrderDiscount", () => {
  let orderRepository: jest.Mocked<IOrderRepository>;
  let mailRepository: jest.Mocked<IMailRepository>;
  let emailProvider: jest.Mocked<IEmailProvider>;
  let applyOrderDiscount: ApplyOrderDiscount;

  beforeEach(() => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as IOrderRepository as jest.Mocked<IOrderRepository>;

    mailRepository = {
      getApplyOrderDiscountEmail: jest.fn(),
      getUpdateOrderItemPriceAbove10PercentEmail: jest.fn(),
    } as IMailRepository as jest.Mocked<IMailRepository>;

    emailProvider = {
      sendEmail: jest.fn(),
    } as IEmailProvider as jest.Mocked<IEmailProvider>;

    applyOrderDiscount = new ApplyOrderDiscount(
      orderRepository,
      mailRepository,
      emailProvider
    );
  });

  it("should throw an error if the order is not found", async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(
      applyOrderDiscount.execute(1, {} as IApplyOrderDiscountDto)
    ).rejects.toThrow("Order not found");
    expect(orderRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should apply discount and send an email", async () => {
    const mockOrder: IOrder = {
      id: 1,
      totalPrice: 100,
      discount: 0,
      discountReason: "",
      status: EOrderStatus.CREATED,
      type: EOrderType.ONLINE,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerId: 123,

      customer: { email: "customer@example.com" } as ICustomer,
      items: [],
      applyDiscount: jest.fn(),
    };

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

    await applyOrderDiscount.execute(1, mockDto);

    expect(orderRepository.findById).toHaveBeenCalledWith(1);
    expect(mockOrder.applyDiscount).toHaveBeenCalledWith(mockDto);
    expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    expect(mailRepository.getApplyOrderDiscountEmail).toHaveBeenCalled();
    expect(emailProvider.sendEmail).toHaveBeenCalledWith({
      to: "customer@example.com",
      body: "Discount applied",
      subject: "Discount Notification",
    });
  });
});
