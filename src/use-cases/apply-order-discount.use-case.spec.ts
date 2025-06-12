import { Order } from "../entities/order.entity";
import { EOrderStatus } from "../shared/enums/order-status.enum";
import { EOrderType } from "../shared/enums/order-type.enum";
import { IApplyOrderDiscountDto } from "../shared/interfaces/dto/apply-order-discount-dto.interface";
import { EmailProviderMock } from "../shared/mocks/email-provider.mock";
import { MailRepositoryMock } from "../shared/mocks/mail-repository.mock";
import { OrderRepositoryMock } from "../shared/mocks/order-repository.mock";
import { ApplyOrderDiscount } from "./apply-order-discount.use-case";

enum OrderRepositoryMockEnum {
  FOUND = 1,
  NOT_FOUND = 2,
}

const setup = (orderTestInstance: OrderRepositoryMockEnum) => {
  const orderRepositoryMock = new OrderRepositoryMock();
  const mailRepositoryMock = new MailRepositoryMock();
  const emailProviderMock = new EmailProviderMock();
  const applyOrderDiscountMock = new ApplyOrderDiscount(
    orderRepositoryMock,
    mailRepositoryMock,
    emailProviderMock
  );

  const orderMock = Object.assign(new Order(), {
    items: [{ isPromotional: false } as any],
    type: EOrderType.PHYSICAL,
    status: EOrderStatus.CREATED,
    totalPrice: 100,
    discount: 0,
  });

  if (orderTestInstance === OrderRepositoryMockEnum.NOT_FOUND)
    orderRepositoryMock.findById.mockReturnValue(null);

  if (orderTestInstance === OrderRepositoryMockEnum.FOUND)
    orderRepositoryMock.findById.mockReturnValue(orderMock);

  const orderIdMock = 1;

  const dtoMock: IApplyOrderDiscountDto = {
    discount: 10,
    discountReason: "Test",
  };

  return { applyOrderDiscountMock, orderIdMock, dtoMock };
};

describe(ApplyOrderDiscount.name, () => {
  it("deve lançar erro quando o pedido não é encontrado", async () => {
    const { applyOrderDiscountMock, orderIdMock, dtoMock } = setup(
      OrderRepositoryMockEnum.NOT_FOUND
    );

    const result = applyOrderDiscountMock.execute(orderIdMock, dtoMock);

    expect(() => {
      result.then((res) => {
        expect(res).toBeUndefined();
      });
    }).toThrow(Error);
  });

  it("deve aplicar o desconto ao pedido", async () => {
    const { applyOrderDiscountMock, orderIdMock, dtoMock } = setup(
      OrderRepositoryMockEnum.FOUND
    );

    const result = applyOrderDiscountMock.execute(orderIdMock, dtoMock);

    expect(() => {
      result.then((res) => {
        expect(res).toBeUndefined();
      });
    }).not.toThrow();
  });
});
