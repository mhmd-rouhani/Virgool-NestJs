import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn} from "typeorm";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BlogStatus} from "../enums/status.enum";
import {IsNotEmpty, IsOptional} from "class-validator";
import {UserEntity} from "../../user/entities/user.entity";
import {BlogLikesEntity} from "./like.entity";
import {BlogBookmarkEntity} from "./bookmark.entity";
import {BlogCommentEntity} from "./comment.entity";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    content: string;

    @Column({nullable: true})
    image: string;

    @Column({unique: true})
    slug: string;

    @Column({nullable: true})
    time_for_study: string

    @Column({default: BlogStatus.Draft})
    status: string;

    @Column()
    author_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // RELATIONS
    @ManyToOne(() => UserEntity, user => user.blogs, {onDelete: "CASCADE"})
    author: UserEntity;

    @OneToMany(() => BlogLikesEntity, like => like.blog)
    likes: BlogLikesEntity[];

    @OneToMany(() => BlogBookmarkEntity, blogBookmark => blogBookmark.blog)
    bookmarks: BlogBookmarkEntity[];

    @OneToMany(() => BlogCommentEntity, blogComment => blogComment.blog)
    comments: BlogCommentEntity[];
}