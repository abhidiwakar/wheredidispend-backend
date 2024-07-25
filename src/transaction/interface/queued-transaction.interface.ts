export interface QueuedTransaction {
  bucketName: string;
  bucketRegion: string;
  mediaKey: string;
  from: string;
  source?: string; // Plugin name, Ex. Telegram, WhatsApp
  image: Image;
  senderInfo: SenderInfo;
  transactionData: TransactionData;
}

interface TransactionData {
  amount_paid: string;
  currency: string;
  paid_to: string;
  receiver_upi_id: string;
  upi_reference_id: string;
  datetime: string;
  upi_app: string;
}

interface SenderInfo {
  name?: string;
  id: string;
}

interface Image {
  mime_type?: string;
  caption?: string;
}
