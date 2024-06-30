import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors(); // to enable the front end to hit another port
  await app.listen(3000);
}
bootstrap();
