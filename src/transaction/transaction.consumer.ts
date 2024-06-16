import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Constants } from 'src/utils/constants';
import { TransactionService } from './transaction.service';
import { Job } from 'bull';
import { QueuedTransaction } from './interface/queued-transaction.interface';

@Processor(Constants.DataQueue)
export class TransactionConsumer {
  private readonly logger = new Logger(TransactionConsumer.name);
  constructor(private readonly transactionService: TransactionService) {}

  @Process('add-transaction')
  async transcode(job: Job<QueuedTransaction>) {
    return this.transactionService.processQueuedTransactions(job.data);
  }
}
