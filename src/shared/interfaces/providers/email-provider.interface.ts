import { ISendEmailDto } from "../dto/send-email-dto.interface";

export interface IEmailProvider {
  sendEmail(dto: ISendEmailDto): Promise<void>;
}
