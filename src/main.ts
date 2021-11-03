import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DispatchError } from '../common/filters/dispatch-error.filter';
import * as cookieParser from 'cookie-parser';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new DispatchError());
  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  app.use(json({ limit: '100mb' }))

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port || 8080);
}
bootstrap();
