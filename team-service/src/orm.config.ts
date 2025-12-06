import { DataSource } from 'typeorm';
import { Team } from './team/entities/team.entity';
import { Player } from './team/entities/player.entity';
import { PlayerSkillImprovement } from './team/entities/player-skill-improvement.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/football_teams',
  entities: [Team, Player, PlayerSkillImprovement],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
});
