import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamService } from "./team.service";
import { TeamController } from "./team.controller";
import { TeamConsumer } from "./team.consumer";
import { PlayerSkillController } from "./player-skill.controller";
import { Team } from "./entities/team.entity";
import { Player } from "./entities/player.entity";
import { PlayerSkillImprovement } from "./entities/player-skill-improvement.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Team, Player, PlayerSkillImprovement])],
  providers: [TeamService],
  controllers: [TeamController, TeamConsumer, PlayerSkillController],
  exports: [TeamService],
})
export class TeamModule {}
