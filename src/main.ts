import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
const env = dotenv.config();
dotenvExpand.expand(env);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static-assets/',
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },
      {
        path: 'static-assets/(.*)',
        method: RequestMethod.GET,
      },
      {
        path: 'v/(.*)',
        method: RequestMethod.GET,
      },
    ],
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
