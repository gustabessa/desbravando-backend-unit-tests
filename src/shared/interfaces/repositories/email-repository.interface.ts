export interface IMailRepository {
  getApplyOrderDiscountEmail(): { subject: string; body: string };
  getUpdateOrderItemPriceAbove10PercentEmail(): {
    subject: string;
    body: string;
  };
}
