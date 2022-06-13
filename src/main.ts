import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService: PrismaService = app.get(PrismaService);

  const config = new DocumentBuilder()
    .setTitle('Pegasus')
    .setDescription('The Pegasus API description')
    .setVersion('1.0')
    .addTag('users')
    .build();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  prismaService.enableShutdownHooks(app);

  await app.listen(3000);
}
bootstrap();
