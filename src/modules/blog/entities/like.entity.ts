import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {UserEntity} from "../../user/entities/user.entity";
import {BlogEntity} from "./blog.entity";

@Entity(EntityNames.BlogLikes)
export class BlogLikesEntity extends BaseEntity {

    @Column()
    user_id: number;
    @ManyToOne(() => UserEntity, user => user.blog_likes, {onDelete: "CASCADE"})
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @Column()
    blog_id: number;
    @ManyToOne(() => BlogEntity, blog => blog.likes, {onDelete: "CASCADE"})
    @JoinColumn({ name: "blog_id" })
    blog: BlogEntity;
}