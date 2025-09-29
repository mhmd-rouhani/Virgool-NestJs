import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {EntityNames} from "../../../common/enums/entity.enum";
import {UserEntity} from "../../user/entities/user.entity";
import {BlogEntity} from "./blog.entity";

@Entity(EntityNames.BlogComment)
export class BlogCommentEntity extends BaseEntity {
    @Column()
    text: string;

    @Column({default: false})
    accepted: boolean;

    @Column()
    blog_id: number;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    parent_id: number;

    @ManyToOne(() => UserEntity, user => user.blog_comments, {onDelete: "CASCADE"})
    user: UserEntity;

    @ManyToOne(() => BlogEntity, blog => blog.comments, {onDelete: "CASCADE"})
    blog: BlogEntity;

    @ManyToOne(() => BlogCommentEntity, parent => parent.children, {onDelete: "CASCADE"})
    parent: BlogCommentEntity
    @OneToMany(() => BlogCommentEntity, comment => comment.parent)
    @JoinColumn({name: "parent"})
    children: BlogCommentEntity[];
}