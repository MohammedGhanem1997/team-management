import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Player } from "./player.entity";
import { BaseEntityCommon } from "../../common/base.entity";

@Entity("teams")
export class Team extends BaseEntityCommon {
  @Column()
  userId: string;

  @Column()
  name: string;

  @Column("int")
  budget: number;

  @Column({
    type: "enum",
    enum: ["creating", "ready", "error"],
    default: "creating",
  })
  status: "creating" | "ready" | "error";

  @OneToMany(() => Player, (player) => player.team)
  players: Player[];
}
