import { Entity, Column } from "typeorm";
import { BaseEntityCommon } from "../../common/base.entity";

@Entity("users")
export class User extends BaseEntityCommon {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
