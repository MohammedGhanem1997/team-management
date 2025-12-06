"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const microservice = app.connectMicroservice({
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [config.get('rmqUrl') || 'amqp://localhost:5672'],
            queue: 'auth_queue',
            queueOptions: {
                durable: false
            },
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.startAllMicroservices();
    await app.listen(config.get('port') || 3001);
    console.log(`Auth service running on port ${config.get('port') || 3001}`);
}
bootstrap();
//# sourceMappingURL=main.js.map