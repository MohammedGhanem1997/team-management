import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService)
  
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>('rmqUrl') || 'amqp://localhost:5672'],
      queue: 'team_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  await app.startAllMicroservices();
  await app.listen(config.get<number>('port') || 3002);
  console.log(`Team service running on port ${config.get<number>('port') || 3002}`);
}
bootstrap();
