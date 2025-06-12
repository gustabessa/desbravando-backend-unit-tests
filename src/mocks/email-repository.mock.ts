import { IMailRepository } from "../shared/interfaces/repositories/email-repository.interface";

export class EmailRepositoryMock implements IMailRepository {
  getApplyOrderDiscountEmail = jest.fn().mockReturnValue({
    body: "Test email body",
    subject: "Test subject",
  });
  getUpdateOrderItemPriceAbove10PercentEmail = jest.fn();
}
