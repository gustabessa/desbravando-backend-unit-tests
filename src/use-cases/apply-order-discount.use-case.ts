import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { IEmailProvider } from "../shared/interfaces/providers/email-provider.interface";
import { IMailRepository } from "../shared/interfaces/repositories/email-repository.interface";
import { IOrderRepository } from "../shared/interfaces/repositories/order-repository.interface";

export class ApplyOrderDiscount {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly mailRepository: IMailRepository,
    private readonly emailProvider: IEmailProvider
  ) {}

  async execute(orderId: number, dto: IApplyOrderDiscountDto) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.applyDiscount(dto);
    await this.orderRepository.save(order);

    const { body, subject } = this.mailRepository.getApplyOrderDiscountEmail();
    await this.emailProvider.sendEmail({
      to: order.customer.email,
      body,
      subject,
    });
  }
}
