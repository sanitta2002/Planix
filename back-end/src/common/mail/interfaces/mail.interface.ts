export interface IMailService {
  sendOtpMail(email: string, otp: string): Promise<void>;
}
