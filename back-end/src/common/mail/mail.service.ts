import { Injectable } from '@nestjs/common';
import { IMailService } from './interfaces/mail.interface';
import nodemailer from 'nodemailer';
import { OtpTemplate } from './emailOtpTemplate';
@Injectable()
export class MailService implements IMailService {
  private transporter;
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
    const html=OtpTemplate.generate(otp)
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      Subject: 'Verify Your Planix Account',
      html:html
    });
  }
}
