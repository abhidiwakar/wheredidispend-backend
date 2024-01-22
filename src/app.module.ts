import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from 'nestjs-firebase';
import * as serviceAccount from './secrets/firebase/service-account-key.json';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 5000,
        limit: 5,
      },
    ]),
    MongooseModule.forRoot(process.env.MONGO_URI),
    FirebaseModule.forRoot({
      googleApplicationCredential: serviceAccount as unknown,
    }),
    TransactionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
