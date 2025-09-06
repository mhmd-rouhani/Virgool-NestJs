import {Column, Entity} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";

@Entity(EntityNames.Profile)
export class ProfileEntity extends BaseEntity {
    @Column()
    bio: string
    @Column({nullable: true})
    nick_name: string
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
}