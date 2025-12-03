import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [ConfigModule], // Permite usar ConfigService para variáveis de ambiente
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService], // Permite que outros módulos usem o MailService
})
export class MailModule {}
