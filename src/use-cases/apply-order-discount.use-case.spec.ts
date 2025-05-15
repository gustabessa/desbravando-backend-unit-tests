import {IOrderRepository} from "../shared/interfaces/repositories/order-repository.interface";
import {IMailRepository} from "../shared/interfaces/repositories/email-repository.interface";
import {IEmailProvider} from "../shared/interfaces/providers/email-provider.interface";
import {ApplyOrderDiscount} from "./apply-order-discount.use-case";


describe("ApplyOrderDiscount", () => {
    it("should apply discount to order and send email", async () => {
        const orderId = 1;
        const dto = {
            discount: 10,
            discountReason: "test"
        };

        const orderRepositoryMock: jest.Mocked<IOrderRepository> = {
            findById: jest.fn().mockResolvedValue({
                id: orderId,
                customer: {
                    email: "xitao@test.com",
                },
                applyDiscount: jest.fn(),
            }),
            save: jest.fn(),
        };

        const mailRepositoryMock: jest.Mocked<IMailRepository> = {
            getApplyOrderDiscountEmail: jest.fn().mockReturnValue({
                to: "xitao@test.com",
                subject: "Desconto aplicado",
                body: "Seu desconto foi aplicado com sucesso.",
            }),
            getUpdateOrderItemPriceAbove10PercentEmail: jest.fn()
        };

        const emailProviderMock: jest.Mocked<IEmailProvider> = {
            sendEmail: jest.fn(),
        };

        const applyOrderDiscount = new ApplyOrderDiscount(
            orderRepositoryMock,
            mailRepositoryMock,
            emailProviderMock
        );

        await applyOrderDiscount.execute(orderId, dto);

        expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
        expect(orderRepositoryMock.save).toHaveBeenCalled();
        expect(mailRepositoryMock.getApplyOrderDiscountEmail).toHaveBeenCalled();
        expect(emailProviderMock.sendEmail).toHaveBeenCalledWith({
            to: "xitao@test.com",
            subject: "Desconto aplicado",
            body: "Seu desconto foi aplicado com sucesso.",
        });
    });

    it("should throw error if order not found", async () => {
        const orderId = 1;
        const dto = {
            discount: 10,
            discountReason: "test"
        };

        const orderRepositoryMock: jest.Mocked<IOrderRepository> = {
            findById: jest.fn().mockResolvedValue(null),
            save: jest.fn(),
        };

        const mailRepositoryMock: jest.Mocked<IMailRepository> = {
            getApplyOrderDiscountEmail: jest.fn(),
            getUpdateOrderItemPriceAbove10PercentEmail: jest.fn()
        };

        const emailProviderMock: jest.Mocked<IEmailProvider> = {
            sendEmail: jest.fn(),
        };

        const applyOrderDiscount = new ApplyOrderDiscount(
            orderRepositoryMock,
            mailRepositoryMock,
            emailProviderMock
        );

        await expect(applyOrderDiscount.execute(orderId, dto)).rejects.toThrow("Order not found");
        expect(orderRepositoryMock.save).not.toHaveBeenCalled();
    });
});







