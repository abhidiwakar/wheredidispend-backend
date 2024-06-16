import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        baseURL: `https://graph.facebook.com/v${configService.get(
          'FB_GRAPH_API_VERSION',
          '19.0',
        )}/${configService.getOrThrow('WB_FROM_NUMBER_ID')}`,
        headers: {
          Authorization: `Bearer ${configService.getOrThrow(
            'WB_ACCESS_TOKEN',
          )}`,
        },
      }),
    }),
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
