import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { IEmailProvider } from "../shared/interfaces/providers/email-provider.interface";
import { IMailRepository } from "../shared/interfaces/repositories/email-repository.interface";
import { IOrderItemRepository } from "../shared/interfaces/repositories/order-item.repository.interface";

export class UpdateOrderItemPrice {
  constructor(
    private readonly orderItemRepository: IOrderItemRepository,
    private readonly mailRepository: IMailRepository,
    private readonly emailProvider: IEmailProvider
  ) {}

  async execute(orderItemId: number, newOrderItemPrice: number) {
    const orderItem = await this.orderItemRepository.findById(orderItemId);

    if (!orderItem) {
      throw new Error("Order not found");
    }

    try {
      orderItem.updateOrderPrice(newOrderItemPrice);
      await this.orderItemRepository.save(orderItem);
    } catch (error) {
      if (error instanceof DomainRuleException) {
        const { body, subject } =
          this.mailRepository.getUpdateOrderItemPriceAbove10PercentEmail();
        await this.emailProvider.sendEmail({
          to: orderItem.order.customer.email,
          body,
          subject,
        });
      }

      throw error;
    }
  }
}
