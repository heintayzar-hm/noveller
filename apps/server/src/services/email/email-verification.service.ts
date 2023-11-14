
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {  EmailService } from './email.service';
import * as nodemailer from 'nodemailer';
import * as pug from 'pug';
import { mailTemplatesVar,mails } from './constants';
@Injectable()
export class EmailVerificationService extends EmailService {
  private mailTemplatesVar = {
    ...mailTemplatesVar,
  }
  private mails = {
    ...mails,
  }
    constructor(configService: ConfigService, emailTemplateRoot: string) {
        super(configService, emailTemplateRoot);
    }

  async sendVerificationEmail(to: string, code: number, name: string) {
    const templatePath = this.getTemplatePath(`${this.mails.confirmEmail.template}/html.pug`);
    const template = pug.compileFile(templatePath);

    const emailContent = template({ code: code, name, ...this.mailTemplatesVar });

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.getOrThrow('MAIL_FROM'),
      to,
      subject: `Hi, ${name}! ${this.mails.confirmEmail.subject}`,
      html: emailContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${to}`);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }
}
