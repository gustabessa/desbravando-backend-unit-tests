import { IMailRepository } from "../interfaces/repositories/email-repository.interface";

export class EmailRepositoryMock implements IMailRepository {
  getApplyOrderDiscountEmail = jest.fn();
  getUpdateOrderItemPriceAbove10PercentEmail = jest.fn();
}
