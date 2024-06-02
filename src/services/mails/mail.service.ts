import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailTemplateService } from 'src/templates/email.template';

@Injectable()
export class MailService {
  private logger = new Logger();
  constructor(
    private readonly configService: ConfigService,
    private templateService: MailTemplateService,
  ) {}

  async sendVerificationMail(to: string, subject: string, token: string): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get<string>('EMAIL_ID'),
          pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
      });

      const mailOptions = {
        from: this.configService.get<string>('EMAIL_ID'),
        to,
        subject,
        html: this.templateService.verifyMailTemplate(
          to,
          `${this.configService.get<string>('ORIGIN')}/auth/verify?token=${token}`,
        ),
      };

      await transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to} at ${new Date().toLocaleString()}`);
      return true; // Mail sent successfully
    } catch (error) {
      console.error('Error sending email:', error);
      this.logger.error(
        `Error sending email to ${to}: ${error} at ${new Date().toLocaleString()}`,
      );
      return false; // Failed to send email
    }
  }

  async sendUpdatePasswordRequestMail(to: string, subject: string, resetLink: string): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get<string>('EMAIL_ID'),
          pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
      });

      const mailOptions = {
        from: this.configService.get<string>('EMAIL_ID'),
        to,
        subject,
        html: this.templateService.updateMailTemplate(to,`${this.configService.get<string>('ORIGIN')}/auth/update-password?token=${resetLink}`,),
      };

      await transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to} at ${new Date().toLocaleString()}`);
      return true; // Mail sent successfully
    } catch (error) {
      console.error('Error sending email:', error);
      this.logger.error(
        `Error sending email to ${to}: ${error} at ${new Date().toLocaleString()}`,
      );
      return false; // Failed to send email
    }
  }
}
