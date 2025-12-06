import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransferService } from "./transfer.service";
import { TransferController } from "./transfer.controller";
import { Team } from "../team/entities/team.entity";
import { Player } from "../team/entities/player.entity";
import { TeamService } from "../team/team.service";
import { PlayerSkillImprovement } from "../team/entities/player-skill-improvement.entity";
import { TeamModule } from "../team/team.module";

@Module({
  imports: [TypeOrmModule.forFeature([Team, Player, PlayerSkillImprovement]), TeamModule],
  providers: [TransferService],
  controllers: [TransferController],
})
export class TransferModule {}
