import { IMailRepository } from "../repositories/email-repository.interface";

export class MailRepositoryMock implements IMailRepository {
  getApplyOrderDiscountEmail = jest.fn();
  getUpdateOrderItemPriceAbove10PercentEmail = jest.fn();
}
