"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const apm = require("elastic-apm-node");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    apm.start({
        serviceName: "api-gateway",
        serverUrl: configService.get("APM_SERVER_URL") || "",
        active: !!configService.get("APM_SERVER_URL") || true,
    });
    console.log("🚀 ~ file: main.ts:19 ~ ", {
        serviceName: "api-gateway",
        serverUrl: configService.get("APM_SERVER_URL") || "",
        active: !!configService.get("APM_SERVER_URL") || true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Football Manager API")
        .setDescription("Football Online Manager System API")
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Paste your JWT token here. Format: Bearer <token>. Obtain token from /auth/login or /auth/register.",
        in: "header",
    }, "JWT")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
        allowedHeaders: "Content-Type, Authorization",
        credentials: true,
    });
    await app.listen(process.env.PORT || 3000);
    console.log(`API Gateway running on port ${process.env.PORT || 3000}`);
    console.log(`Swagger docs available at http://localhost:${process.env.PORT || 3000}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map