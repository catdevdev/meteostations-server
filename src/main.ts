import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('WeatherRecord server')
    .setDescription('Documentation REST API')
    .setVersion('1.0.0')
    .addTag('WR')
    .addBearerAuth()
    .build();
  const documentation = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/swagger', app, documentation);

  await app.listen(3000);
}
bootstrap();
