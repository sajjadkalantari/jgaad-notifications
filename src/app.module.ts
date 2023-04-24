import { Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from './notifications/notifications.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from "./utilities/jwt.strategy";
import * as fs from 'fs';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_COONECTION_STRING),
    NotificationsModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [JwtStrategy],

})
export class AppModule {

  static async setupSwagger(app) {
    
    const options = new DocumentBuilder()
      .setTitle('Jgaad API')
      .setDescription('api documentations')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('docs', app, document);
    fs.writeFileSync('swagger.json', JSON.stringify(document));

  }
}
