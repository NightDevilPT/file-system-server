import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { sendVerificationMailTemplate } from 'src/templates/send-mail.template';

@Injectable()
export class MailService {
  private logger = new Logger();
  constructor(private readonly configService: ConfigService) {}

  async sendMail(to: string, subject: string, token: string): Promise<boolean> {
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
        html: sendVerificationMailTemplate(
          to,
          `${this.configService.get<string>('ORIGIN')}/auth/verify?token=${token}`,
        ),
      };

      await transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to} at ${new Date().toLocaleString()}`);
      return true; // Mail sent successfully
    } catch (error) {
      console.error('Error sending email:', error);
      this.logger.error(`Error sending email to ${to}: ${error} at ${new Date().toLocaleString()}`);
      return false; // Failed to send email
    }
  }
}
