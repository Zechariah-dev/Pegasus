import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Pegasus')
    .setDescription('The Pegasus API description')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth({
      type: 'http',
      name: 'authorization',
      in: 'headers',
      bearerFormat: 'Bearer ',
    })
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
