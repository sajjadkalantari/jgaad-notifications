import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  await AppModule.setupSwagger(app); // add this line
  await app.listen(3000);
}
bootstrap();
