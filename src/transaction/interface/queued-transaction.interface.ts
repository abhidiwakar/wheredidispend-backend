export interface QueuedTransaction {
  bucketName: string;
  bucketRegion: string;
  mediaKey: string;
  from: string;
  id: string;
  timestamp: string;
  type: string;
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
  name: string;
  waId: string;
  display_phone_number: string;
  phone_number_id: string;
}

interface Image {
  mime_type: string;
  sha256: string;
  id: string;
  caption?: string;
}
