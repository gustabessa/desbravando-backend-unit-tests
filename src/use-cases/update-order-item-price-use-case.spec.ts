import { Customer } from "../entities/customer.entity";
import { OrderItem } from "../entities/order-item.entity";
import { Order } from "../entities/order.entity";
import { DomainRuleException } from "../shared/errors/domain-rule-exception";
import { EmailProviderMock } from "../shared/mocks/email-provider.mock";
import { MailRepositoryMock } from "../shared/mocks/mail-repository.mock";
import { OrderItemRepositoryMock } from "../shared/mocks/order-item-repository.mock";
import { UpdateOrderItemPrice } from "./update-order-item-price.use-case";

describe("UpdateOrderItemPriceUseCase", () => {
  describe("[execute]", () => {
    let updateOrderItemPrice: UpdateOrderItemPrice;
    let mailRepository: MailRepositoryMock;
    let emailProvider: EmailProviderMock;
    let orderItemRepository: OrderItemRepositoryMock;

    const orderItemId = 1;
    const newOrderItemPrice = 100;

    beforeEach(() => {
      mailRepository = new MailRepositoryMock();
      emailProvider = new EmailProviderMock();
      orderItemRepository = new OrderItemRepositoryMock();

      updateOrderItemPrice = new UpdateOrderItemPrice(
        orderItemRepository,
        mailRepository,
        emailProvider
      );
    });

    it("Should return an error if order item not found", async () => {
      const orderItemId = 1;

      orderItemRepository.findById.mockResolvedValue(null);

      await expect(
        updateOrderItemPrice.execute(orderItemId, 100)
      ).rejects.toThrow("Order not found");
    });

    it("should send email when occurs an DomainRuleException error", async () => {
      const mockBody = "Email Body";
      const mockSubject = "Email Subject";

      const orderItemMock = new OrderItem();
      const orderMock = new Order();
      const customerMock = new Customer();

      Reflect.set(customerMock, "email", "teste@email.com");
      Reflect.set(orderMock, "customer", customerMock);

      Object.assign(orderItemMock, {
        updateOrderPrice: jest.fn().mockImplementation(() => {
          throw new DomainRuleException("Price is too low");
        }),
        order: orderMock,
      });

      orderItemRepository.findById.mockResolvedValue(orderItemMock);
      mailRepository.getUpdateOrderItemPriceAbove10PercentEmail.mockReturnValue(
        {
          body: mockBody,
          subject: mockSubject,
        }
      );

      await expect(
        updateOrderItemPrice.execute(orderItemId, newOrderItemPrice)
      ).rejects.toThrow(DomainRuleException);
      expect(orderItemRepository.save).not.toHaveBeenCalled();
      expect(
        mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
      ).toHaveBeenCalled();
      expect(emailProvider.sendEmail).toHaveBeenCalledWith({
        to: orderItemMock.order.customer.email,
        body: mockBody,
        subject: mockSubject,
      });
    });

    it("should return an error when fails to update order item price", async () => {
      const errorMessage = "Failed to update order item price";

      const orderItemMock = new OrderItem();
      Object.assign(orderItemMock, {
        updateOrderPrice: jest.fn().mockImplementation(() => {
          throw new Error(errorMessage);
        }),
      });

      orderItemRepository.findById.mockResolvedValue(orderItemMock);

      await expect(
        updateOrderItemPrice.execute(orderItemId, newOrderItemPrice)
      ).rejects.toThrow(errorMessage);
      expect(orderItemRepository.save).not.toHaveBeenCalled();
      expect(
        mailRepository.getUpdateOrderItemPriceAbove10PercentEmail
      ).not.toHaveBeenCalled();
    });

    it("should update order item price when valid order item", async () => {
      const orderItemMock = new OrderItem();
      Object.assign(orderItemMock, {
        updateOrderPrice: jest.fn(),
      });

      orderItemRepository.findById.mockResolvedValue(orderItemMock);

      await updateOrderItemPrice.execute(orderItemId, newOrderItemPrice);

      expect(orderItemRepository.findById).toHaveBeenCalledWith(orderItemId);
      expect(orderItemMock.updateOrderPrice).toHaveBeenCalledWith(
        newOrderItemPrice
      );
      expect(orderItemRepository.save).toHaveBeenCalledWith(orderItemMock);
    });
  });
});
