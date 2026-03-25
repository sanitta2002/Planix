export interface IMailService {
  sendOtpMail(email: string, otp: string): Promise<void>;
  sendInvitationMail(email: string, inviteLink: string): Promise<void>;
}
