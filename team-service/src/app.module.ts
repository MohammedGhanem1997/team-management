import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TeamModule } from './team/team.module';
import { TransferModule } from './transfer/transfer.module';
import { Team } from './team/entities/team.entity';
import { Player } from './team/entities/player.entity';
// Club entity removed after schema redesign
import { PlayerSkillImprovement } from './team/entities/player-skill-improvement.entity';
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
        entities: [Team, Player, PlayerSkillImprovement],
        synchronize: false,
        logging: false,
        migrationsRun: true,
        migrations: ['dist/migrations/*.js'],
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('rmqUrl')],
            queue: 'auth_queue',
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
    TeamModule,
    TransferModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
