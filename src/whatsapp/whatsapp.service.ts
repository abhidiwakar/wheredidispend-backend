import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { WhatsappConstants } from './whatsapp.constants';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  constructor(private readonly httpService: HttpService) {}

  private sendMessage(
    to: string,
    template: string,
    bodyParams?: Record<string, unknown>[],
  ) {
    return this.httpService.axiosRef.post('/messages', {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      recipient_type: 'individual',
      template: {
        name: template,
        language: {
          code: 'en',
        },
        components: [
          {
            type: 'body',
            parameters: bodyParams,
          },
        ],
      },
    });
  }

  addViaWhatsAppEnabled(to: string, name?: string) {
    return this.sendMessage(
      to,
      WhatsappConstants.TEMPLATE_ADD_VIA_WHATSAPP_ENABLED,
      [
        {
          type: 'text',
          text: name || 'there',
        },
      ],
    );
  }

  addViaWhatsAppDisabled(to: string, name?: string) {
    return this.sendMessage(
      to,
      WhatsappConstants.TEMPLATE_ADD_VIA_WHATSAPP_DISABLED,
      [
        {
          type: 'text',
          text: name || 'there',
        },
      ],
    );
  }
}
