import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Team } from "./team.entity";
import { BaseEntityCommon } from "../../common/base.entity";

@Entity("player")
export class Player extends BaseEntityCommon {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50 })
  first_name: string;

  @Column({ length: 50 })
  last_name: string;

  @Column({ type: "enum", enum: ["GK", "DEF", "MID", "ATT"] })
  position: "GK" | "DEF" | "MID" | "ATT";

  @Column("int")
  age: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  market_value: string;

  @Column("int")
  overall_rating: number;

  @Column("int")
  pace: number;

  @Column("int")
  shooting: number;

  @Column("int")
  passing: number;

  @Column("int")
  dribbling: number;

  @Column("int")
  defending: number;

  @Column("int")
  physical: number;

  @Column({ nullable: true })
  teamId?: string;

  @ManyToOne(() => Team, (team) => team.players)
  @JoinColumn({ name: "teamId" })
  team?: Team;

  @Column({ default: false })
  isOnTransferList: boolean;

  @Column({ nullable: true })
  askingPrice?: number;
}
