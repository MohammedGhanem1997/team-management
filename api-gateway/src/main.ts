import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
// Rate limiting handled by @nestjs/throttler
import { ConfigService } from "@nestjs/config";
import * as apm from "elastic-apm-node";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  apm.start({
    serviceName: "api-gateway",
    serverUrl: configService.get<string>("APM_SERVER_URL") || "",
    active: !!configService.get<string>("APM_SERVER_URL") || true,
  });
  console.log("🚀 ~ file: main.ts:19 ~ ", {
    serviceName: "api-gateway",
    serverUrl: configService.get<string>("APM_SERVER_URL") || "",
    active: !!configService.get<string>("APM_SERVER_URL") || true,
  });

  const config = new DocumentBuilder()
    .setTitle("Football Manager API")
    .setDescription("Football Online Manager System API")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description:
          "Paste your JWT token here. Format: Bearer <token>. Obtain token from /auth/login or /auth/register.",
        in: "header",
      },
      "JWT"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: false,
  //     crossOriginEmbedderPolicy: false,
  //     crossOriginResourcePolicy: { policy: "cross-origin" },
  //     hsts: true,
  //   })
  // );

  app.enableCors({
    origin: true, // Dynamically allow each origin
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // Allow cookies and other credentials
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`API Gateway running on port ${process.env.PORT || 3000}`);
  console.log(
    `Swagger docs available at http://localhost:${process.env.PORT || 3000}/api`
  );
}
bootstrap();
