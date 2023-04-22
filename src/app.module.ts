import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key-here',
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {


  static async setupSwagger(app) {
    
    const options = new DocumentBuilder()
      .setTitle('Jgaad API')
      .setDescription('test notifications api')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    
    SwaggerModule.setup('docs', app, document);
  }
}
