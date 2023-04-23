import { Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from './notifications/notifications.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/jgaad"),
    NotificationsModule,
    AuthModule
  ],
})
export class AppModule {

  static async setupSwagger(app) {
    
    const options = new DocumentBuilder()
      .setTitle('Jgaad API')
      .setDescription('api documentations')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('docs', app, document);
  }
}
