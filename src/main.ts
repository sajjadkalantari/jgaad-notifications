import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { GlobalExceptionsFilter } from './utilities/dtos/global-exception.filter';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  
  //add swagger
  await AppModule.setupSwagger(app);

  //add global exception handler
  app.useGlobalFilters(new GlobalExceptionsFilter());
  
  await app.listen(3000);
}
bootstrap();
