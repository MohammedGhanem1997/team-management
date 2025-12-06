import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthController } from "./auth/auth.controller";
import { TeamController } from "./team/team.controller";
import { TransferController } from "./transfer/transfer.controller";
import { PlayerController } from "./player/player.controller";
import { AdminController } from "./admin/admin.controller";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { ThrottlerModule } from "@nestjs/throttler";
import appConfig from "./config";
import { APP_GUARD } from "@nestjs/core";
import { ApiThrottlerGuard } from "./common/guards/api-throttler.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    HttpModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: Math.floor(
          (config.get<number>("rateLimit.windowMs") || 60000) / 1000
        ),
        limit: config.get<number>("rateLimit.defaultIpLimit") || 100,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("jwtSecret"),
        signOptions: { expiresIn: "7d" },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: "AUTH_SERVICE",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>("authService.host") || "auth-service",
            port: config.get<number>("authService.port") || 3003,
          },
        }),
      },
      {
        name: "TEAM_SERVICE",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              config.get<string>("RABBITMQ_URL") || "amqp://rabbitmq:5672",
            ],
            queue: "team_queue",
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
  ],
  controllers: [
    AuthController,
    TeamController,
    TransferController,
    PlayerController,
    AdminController,
  ],
  providers: [{ provide: APP_GUARD, useClass: ApiThrottlerGuard }],
})
export class AppModule {}

export class JwtAuthGuard {
  canActivate() {
    return true;
  }
}
