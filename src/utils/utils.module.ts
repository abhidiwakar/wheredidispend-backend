import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'single',
          options: {
            host: configService.getOrThrow('REDIS_HOST'),
            port: configService.getOrThrow('REDIS_PORT'),
            password: configService.getOrThrow('REDIS_TOKEN'),
          },
        };
      },
    }),
  ],
  providers: [S3Service, RedisService],
  exports: [S3Service, RedisService],
})
export class UtilsModule {}
