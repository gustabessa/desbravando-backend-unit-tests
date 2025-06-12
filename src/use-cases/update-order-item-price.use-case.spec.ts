import {IOrderItemRepository} from "../shared/interfaces/repositories/order-item.repository.interface";
import {IMailRepository} from "../shared/interfaces/repositories/email-repository.interface";
import {IEmailProvider} from "../shared/interfaces/providers/email-provider.interface";
import {UpdateOrderItemPrice} from "./update-order-item-price.use-case";
import {DomainRuleException} from "../shared/errors/domain-rule-exception";

describe("UpdateOrderItemPrice", () => {
    it("should update order item price and send email if price is above 10%", async () => {
        const orderItemId = 1;
        const newOrderItemPrice = 150;

        const orderItemRepositoryMock: jest.Mocked<IOrderItemRepository> = {
            findById: jest.fn().mockResolvedValue({
                id: orderItemId,
                price: 100,
                order: {
                    customer: {
                        email: "xitao@test.com",
                    },
                },
                updateOrderPrice: jest.fn().mockImplementation(() => {
                    throw new DomainRuleException("New order price is too low")
                }),
            }),
            save: jest.fn(),
        };

        const mailRepositoryMock: jest.Mocked<IMailRepository> = {
            getUpdateOrderItemPriceAbove10PercentEmail: jest.fn().mockReturnValue({
                subject: "Preço do item atualizado",
                body: "O preço do item foi atualizado para mais de 10%.",
            }),
            getApplyOrderDiscountEmail: jest.fn(),
        };

        const emailProviderMock: jest.Mocked<IEmailProvider> = {
            sendEmail: jest.fn(),
        };

        const updateOrderItemPrice = new UpdateOrderItemPrice(
            orderItemRepositoryMock,
            mailRepositoryMock,
            emailProviderMock
        );

        await expect(updateOrderItemPrice.execute(orderItemId, newOrderItemPrice)).rejects.toThrow("New order price is too low");

        expect(orderItemRepositoryMock.findById).toHaveBeenCalledWith(orderItemId);
        expect(orderItemRepositoryMock.save).not.toHaveBeenCalled();
        expect(mailRepositoryMock.getUpdateOrderItemPriceAbove10PercentEmail).toHaveBeenCalled();
        expect(emailProviderMock.sendEmail).toHaveBeenCalledWith({
            to: "xitao@test.com",
            body: "O preço do item foi atualizado para mais de 10%.",
            subject: "Preço do item atualizado",
        });
    });
});

it("should throw error if order item not found", async () => {
    const orderItemId = 1;
    const newOrderItemPrice = 150;

    const orderItemRepositoryMock: jest.Mocked<IOrderItemRepository> = {
        findById: jest.fn().mockResolvedValue(null),
        save: jest.fn(),
    };

    const mailRepositoryMock: jest.Mocked<IMailRepository> = {
        getUpdateOrderItemPriceAbove10PercentEmail: jest.fn(),
        getApplyOrderDiscountEmail: jest.fn(),
    };

    const emailProviderMock: jest.Mocked<IEmailProvider> = {
        sendEmail: jest.fn(),
    };

    const updateOrderItemPrice = new UpdateOrderItemPrice(
        orderItemRepositoryMock,
        mailRepositoryMock,
        emailProviderMock
    );

    await expect(updateOrderItemPrice.execute(orderItemId, newOrderItemPrice)).rejects.toThrow("Order not found");
    expect(orderItemRepositoryMock.save).not.toHaveBeenCalled();
});

it("should is successfully update order item price if new price is valid", async () => {
    const orderItemId = 1;
    const newOrderItemPrice = 120;

    const orderItemRepositoryMock: jest.Mocked<IOrderItemRepository> = {
        findById: jest.fn().mockResolvedValue({
            id: orderItemId,
            price: 100,
            updateOrderPrice: jest.fn(),
            order: {
                customer: {
                    email: "xitao@test.com",
                },
            },
        }),
        save: jest.fn(),
    };

    const mailRepositoryMock: jest.Mocked<IMailRepository> = {
        getUpdateOrderItemPriceAbove10PercentEmail: jest.fn().mockReturnValue({
            subject: "Preço do item atualizado",
            body: "O preço do item foi atualizado para mais de 10%.",
        }),
        getApplyOrderDiscountEmail: jest.fn(),
    };

    const emailProviderMock: jest.Mocked<IEmailProvider> = {
        sendEmail: jest.fn(),
    };

    const updateOrderItemPrice = new UpdateOrderItemPrice(
        orderItemRepositoryMock,
        mailRepositoryMock,
        emailProviderMock
    );

    await updateOrderItemPrice.execute(orderItemId, newOrderItemPrice);

    expect(orderItemRepositoryMock.findById).toHaveBeenCalledWith(orderItemId);
    expect(orderItemRepositoryMock.save).toHaveBeenCalled();
    expect(mailRepositoryMock.getUpdateOrderItemPriceAbove10PercentEmail).not.toHaveBeenCalled();
    expect(emailProviderMock.sendEmail).not.toHaveBeenCalled();
});