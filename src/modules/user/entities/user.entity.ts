import {Column, CreateDateColumn, Entity, UpdateDateColumn} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({unique: true})
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
}
