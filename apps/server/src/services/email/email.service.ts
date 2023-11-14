// email.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class EmailService {
  protected transporter : nodemailer.Transporter;
  private emailTemplateRoot: string; // Global root directory for email templates

    constructor(protected configService: ConfigService, emailTemplateRoot: string) {

    this.transporter = nodemailer.createTransport({
        host: configService.getOrThrow('MAIL_HOST'),
        port: configService.getOrThrow('MAIL_PORT'),
        auth: {
            user: configService.getOrThrow('MAIL_USER'),
            pass: configService.getOrThrow('MAIL_PASSWORD'),
        }
    });

    this.emailTemplateRoot = emailTemplateRoot;
  }
  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.getOrThrow('MAIL_FROM'),
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  protected getTemplatePath(fileName: string): string {
    return path.join(this.getPublicPathOfMails(), fileName);
  }

  protected getPublicPathOfMails(): string {
    return path.join(__dirname, '../../public/mails', this.emailTemplateRoot);
  }

}
