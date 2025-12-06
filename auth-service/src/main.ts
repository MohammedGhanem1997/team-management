import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>("rmqUrl") || "amqp://localhost:5672"],
      queue: "auth_queue",
      queueOptions: {
        durable: false,
      },
    },
  });

  const tcpMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: "0.0.0.0",
      port: Number(process.env.AUTH_TCP_PORT || 3003),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.startAllMicroservices();
  await app.listen(config.get<number>("port") || 3001);
  console.log(
    `Auth service running on port ${config.get<number>("port") || 3001}`
  );
  console.log(
    `Auth TCP microservice listening on port ${
      process.env.AUTH_TCP_PORT || 3003
    }`
  );
}
bootstrap();
