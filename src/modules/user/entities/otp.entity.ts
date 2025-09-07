import {Column, Entity, OneToOne} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {UserEntity} from "./user.entity";

@Entity(EntityNames.Otp)
export class OtpEntity extends BaseEntity {
    @Column()
    code: string;

    @Column()
    expires_in: Date


    // Relation
    @OneToOne(() => UserEntity, (user) => user.otp, {onDelete: "CASCADE"})
    @Column()
    user_id: number

    user: UserEntity;
}