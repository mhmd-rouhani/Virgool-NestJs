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

    @Column({ nullable: true})
    parent_id: number | null;

    @ManyToOne(() => UserEntity, user => user.blog_comments, {onDelete: "CASCADE"})
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @ManyToOne(() => BlogEntity, blog => blog.comments, {onDelete: "CASCADE"})
    @JoinColumn({ name: "blog_id" })
    blog: BlogEntity;

    @ManyToOne(() => BlogCommentEntity, parent => parent.children, {onDelete: "CASCADE"})
    @JoinColumn({ name: "parent_id" })
    parent: BlogCommentEntity

    @OneToMany(() => BlogCommentEntity, comment => comment.parent)
    children: BlogCommentEntity[];
}