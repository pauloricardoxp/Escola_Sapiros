import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendTestEmail(
    @Body() body: { to: string; subject: string; html: string },
  ) {
    const { to, subject, html } = body;

    await this.mailService.sendMail(to, subject, html);

    return { message: 'Email enviado com sucesso!' };
  }
}
