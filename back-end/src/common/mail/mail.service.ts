import { Injectable } from '@nestjs/common';
import { IMailService } from './interfaces/mail.interface';
import nodemailer, { Transporter } from 'nodemailer';
import { OtpTemplate } from './emailOtpTemplate';
import { InviteTemplate } from './InviteTemplate';
@Injectable()
export class MailService implements IMailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  async sendOtpMail(email: string, otp: string): Promise<void> {
    const html = OtpTemplate.generate(otp);
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Planix Account',
      html: html,
    });
  }
  async sendInvitationMail(email: string, inviteLink: string): Promise<void> {
    const html = InviteTemplate.generate(inviteLink);
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Workspace Invitation',
      html: html,
    });
  }
}
