import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {EntityNames} from "../../../common/enums/entity.enum";
import {UserEntity} from "../../user/entities/user.entity";
import {BlogEntity} from "./blog.entity";

@Entity(EntityNames.BlogBookmark)
export class BlogBookmarkEntity extends BaseEntity {
    @Column()
    user_id : number;
    @ManyToOne(() => UserEntity, (user) => user.blog_bookmarks, {onDelete: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: UserEntity;

    @Column()
    blog_id: number;
    @ManyToOne(() => BlogEntity, blog => blog.bookmarks, {onDelete: "CASCADE"})
    @JoinColumn({name: "blog_id"})
    blog: BlogEntity;
}