import { IEmailProvider } from "../providers/email-provider.interface";

export class EmailProviderMock implements IEmailProvider {
  sendEmail = jest.fn();
}
