import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { BaseEntityCommon } from "../../common/base.entity";
import { Player } from "./player.entity";

@Entity("player_skill_improvements")
@Unique(["playerId", "skill", "improvementDate"])
export class PlayerSkillImprovement extends BaseEntityCommon {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  playerId: string;

  @ManyToOne(() => Player)
  @JoinColumn({ name: "playerId" })
  player: Player;

  @Column({ type: "enum", enum: [
    "pace",
    "shooting",
    "passing",
    "dribbling",
    "defending",
    "physical",
  ] })
  skill: "pace" | "shooting" | "passing" | "dribbling" | "defending" | "physical";

  @Column({ type: "date" })
  improvementDate: string;
}

