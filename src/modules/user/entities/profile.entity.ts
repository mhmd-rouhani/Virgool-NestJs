import {Column, Entity, OneToOne} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {UserEntity} from "./user.entity";

@Entity(EntityNames.Profile)
export class ProfileEntity extends BaseEntity {
    @Column({nullable: true})
    nick_name: string

    @Column({nullable: true})
    bio: string

    @Column({nullable: true})
    image_profile: string

    @Column({nullable: true})
    bg_image: string

    @Column({nullable: true})
    gender: string

    @Column({nullable: true})
    birthday: Date

    @Column({nullable: true})
    linkedin_profile: string

    @Column({nullable: true})
    x_profile: string

    //#relations
    @Column()
    user_id: number
    @OneToOne(
        () => UserEntity,
        (user) => user.profile,
        {onDelete: "CASCADE"}
    )
    user: UserEntity
}