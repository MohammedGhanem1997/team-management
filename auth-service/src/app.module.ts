import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import appConfig from './config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('databaseUrl'),
        entities: [User],
        synchronize: false,
        logging: false,
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'TEAM_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('rmqUrl')],
            queue: 'team_queue',
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
    AuthModule,
  ],
})
export class AppModule {}
