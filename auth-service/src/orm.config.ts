import { DataSource } from 'typeorm';
import { User } from './auth/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/football_auth',
  entities: [User],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
});
