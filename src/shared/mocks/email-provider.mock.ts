import { IEmailProvider } from "../interfaces/providers/email-provider.interface";

export class EmailProviderMock implements IEmailProvider {
  sendEmail = jest.fn();
}
