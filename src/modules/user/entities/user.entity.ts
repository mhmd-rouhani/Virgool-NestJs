import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {OtpEntity} from "./otp.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({unique: true, nullable: true})
    username: string;

    @Column({unique: true, nullable: true})
    phone: string;

    @Column({unique: true, nullable: true})
    email: string;

    @Column({nullable: true})
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relation
    @Column({nullable: true})
    otp_id: number;
    @OneToOne(() => OtpEntity, (otp) => otp.user, {nullable: true})
    @JoinColumn({name: 'otp_id'})
    otp: OtpEntity;
}
