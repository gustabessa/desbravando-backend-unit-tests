import { ISendEmailDto } from "../interfaces/dto/send-email-dto.interface";
import { IEmailProvider } from "../interfaces/providers/email-provider.interface";

export class EmailProviderMock implements IEmailProvider {
  sendEmail = jest.fn();
}
