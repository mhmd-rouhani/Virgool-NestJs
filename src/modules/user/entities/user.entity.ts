import {Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn} from "typeorm";
import {EntityNames} from "../../../common/enums/entity.enum";
import {BaseEntity} from "../../../common/abstracts/BaseEntity";
import {OtpEntity} from "./otp.entity";
import {ProfileEntity} from "./profile.entity";
import {BlogEntity} from "../../blog/entities/blog.entity";
import {BlogLikesEntity} from "../../blog/entities/like.entity";
import {BlogBookmarkEntity} from "../../blog/entities/bookmark.entity";
import {BlogCommentEntity} from "../../blog/entities/comment.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({unique: true, nullable: true})
    username: string;

    @Column({unique: true, nullable: true})
    phone: string;

    @Column({type: "varchar", nullable: true})
    new_phone: string | null;

    @Column({unique: true, nullable: true})
    email: string;

    @Column({type: "varchar", nullable: true})
    new_email: string | null;

    @Column({default: false})
    verify_email: boolean;

    @Column({default: false})
    verify_phone: boolean;

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

    @Column({nullable: true})
    profile_id: number
    @OneToOne(
        () => ProfileEntity,
        (profile) => profile.user,
        {nullable: true}
    )
    @JoinColumn({name: 'profile_id'})
    profile: ProfileEntity;

    @OneToMany(() => BlogEntity, blog => blog.author)
    blogs: BlogEntity[];

    @OneToMany(() => BlogLikesEntity, like => like.user)
    blog_likes: BlogLikesEntity[];

    @OneToMany(() => BlogBookmarkEntity, bookmark => bookmark.user)
    blog_bookmarks: BlogBookmarkEntity[];

    @OneToMany(() => BlogCommentEntity, blogComment => blogComment.user)
    blog_comments: BlogCommentEntity[];
}
